# 实现自己的预编译合约

## 安装Ethereum

``` sh
#git clone
git clone
cd go-ethereum

#重写/core/vm/contracts.go
vim /core/vm/contracts.go

#在相应位置添加
```
......
common.BytesToAddress([]byte{10}): &fyzAdd{},
......
// fyzAdd implemented as a native contract.
type fyzAdd struct{}

func (c *fyzAdd) RequiredGas(input []byte) uint64 {
        return uint64(len(input)+31)/32
}

func (c *fyzAdd) Run(input []byte) ([]byte, error) {

        x := new(big.Int).SetBytes(getData(input, 0, 32))
        y := new(big.Int).SetBytes(getData(input, 32, 32))
        return common.LeftPadBytes(x.Add(x, y).Bytes(), 32), nil
}
```


#项目编译
make all

#运行
cd/build/bin
chmod +x geth
./geth init genesis.json
```

## 启动Geth下的Ethereum

在genesis.json中填写如下内容

```
{
	"config": {
		"chainId": 666,
		"homesteadBlock": 0,
		"eip150Block": 0,
		"eip155Block": 0,
		"eip158Block": 0
	},
	"coinbase" 	 : "0x0000000000000000000000000000000000000000",
	"difficulty" : "0x1",
	"extraData"  : "",
	"gasLimit"   : "0xffffffff",
	"nonce"      : "0x0000000000000042",
	"mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
	"parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
	"timestamp"  : "0x00",
	"alloc"      : {}
}

```

``` sh
./geth --datadir "data" init ./genesis.json

./geth --datadir "data" --networkid 666 --allow-insecure-unlock --nodiscover console
```

```
#创建账户
#密码为123
personal.newAccount("123")
personal.unlockAccount(eth.accounts[0])

#挖矿以获得比特币
#首次挖矿初始化 时间较长
miner.start()
```

## 预编译合约调用方式 :v:

以下代码基于[Remix](http://remix.ethereum.org) Solidity调试



`0x04`地址预编译合约代码

> /core/vm/contracts.go
>> [查看源码](https://github.com/ethereum/go-ethereum/blob/master/core/vm/contracts.go)

``` go
// Line 53
var PrecompiledContractsByzantium = map[common.Address]PrecompiledContract{
	......

	common.BytesToAddress([]byte{4}): &dataCopy{},    
	
	......
}

// data copy implemented as a native contract.
type dataCopy struct{}

// RequiredGas returns the gas required to execute the pre-compiled contract.
//
// This method does not require any overflow checking as the input size gas costs
// required for anything significant is so high it's impossible to pay for.
func (c *dataCopy) RequiredGas(input []byte) uint64 {
	return uint64(len(input)+31)/32*params.IdentityPerWordGas + params.IdentityBaseGas
}
func (c *dataCopy) Run(in []byte) ([]byte, error) {
	return in, nil
}
```

演示：调用`0x04`地址的预编译合约

主要参考[http://www.elecfans.com/blockchain/1061774.html](http://www.elecfans.com/blockchain/1061774.html)

``` solidity
pragma solidity ^0.4.11;

contract C {
    function f(uint256 ax) public constant returns (uint256 p) {
        
        uint256 input;
        input = ax;
        
        assembly{
            mstore(0, input)
            p := 2
            mstore(0x20, p)
            mstore(0x40, p)
            if call(not(0), 0x04, 0, 0, 0x20, 0x20, 0x20){
                //return(0x20, 0x20) //return 8
                return(0x40, 0x20) //return 2
                
            }
        }
    }
}
```

上述代码:

+  `mstore(p, v)` 将v值加载进 `mem[p, p+32]`
+  `call(g, a, v, in, insize, out, outsize)` call contract at address a with input mem[in..(in+insize)) providing g gas and v wei and output area mem[out..(out+outsize)) returning 0 on error (eg. out of gas) and 1 on success.
+ uint256占8 byte, 0x20个mem槽, `4 x 8 = 32`

> 更多 Solidity-Assembly 语法请查阅 [Solidity Documents](https://solidity.readthedocs.io/zh/latest/assembly.html) :hugs:

## 调用fyzAdd()

__特别注意：输出内存空间不能够和输入空间重复__

``` solidity
pragma solidity ^0.4.11;

contract C {
    function f(uint256 ax, uint256 bx) public constant returns (uint256 p) {
        
        uint256 add1;
        uint256 add2;
        add1 = ax;
        add2 = bx;
        
        assembly{
            mstore(0, add1)
            mstore(0x20, add2)
            if call(not(0), 0xa, 0, 0, 0x40, 0x40, 0x60){
                return(0x40, 0x60) //return 8
                //return(0x40, 0x20) //return 2
                
            }
        }
    }
}
```

