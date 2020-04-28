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
