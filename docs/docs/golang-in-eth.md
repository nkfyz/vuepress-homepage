# Ethereum中的golang细节

## 主要操作

+ `[]byte` 转为 `*Int`
+ `Int` 转为 `Int64` 进行计算
+ `Int64` 转回 `[]byte`

## 基本函数

``` go
// []byte 转换为 *Int 类型, 再转换为 Int64 类型
x_uint64 := new(big.Int).SetBytes(getData(input, 0, 32)).Int64()

// Int64 转换为 []byte 类型
common.LeftPadBytes(big.NewInt(temp).Bytes(), 32)
```

## 官方参考

[Package big](https://golang.org/pkg/math/big/)

> [在线Go语言调试](http://go.jsrun.net/)
