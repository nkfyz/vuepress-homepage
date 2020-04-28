# 指令的修改

## 需要修改的目录

完成指令的修改，需要进行以下文件的重新编辑

1. `/core/vm/opcodes.go`
2. `/core/vm/jump_table.go`
3. `/core/vm/instructions.go`

其中，

+ `/core/vm/opcodes.go` 负责指定地址
+ `/core/vm/jump_table.go` 负责注册
+ `/core/vm/instructions.go` 负责编制逻辑

## 基本的卷积算子指令

``` go
var core_row, core_column int = 5, 5

var core = [5][5]int{
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1},
{1, 1, 1, 1, 1}}

var temp int = 0
var i, j int

for i = 0; i < core_row; i++ {
    for j = 0; j < core_column; j++ {
            temp = temp + core[i][j] * core[i][j]
    }
}

x, y := callContext.stack.pop(), callContext.stack.peek()

math.U256(y.Sub(x, y))
a := int64(temp)

math.U256(y.Sub(big.NewInt(a), y))
interpreter.intPool.putOne(x)

return nil, nil
```
