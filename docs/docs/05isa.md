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

## 卷积指令

``` go
func opConv(pc *uint64, interpreter *EVMInterpreter, callContext *callCtx) ([]byte, error){

        offset := 0
        
        core_row := int(new(big.Int).SetBytes(callContext.memory.GetPtr(int64(offset), 32)).Int64())
        
        offset = offset + 32 
        
        var temp int = 0
        
        var i, j int
        
        for i = 0; i < core_row; i++{
                for j = 0; j < core_row; j++{
                        core := int(new(big.Int).SetBytes(callContext.memory.GetPtr(int64(offset), 32)).Int64())
                        offset = offset + 32
                        data := int(new(big.Int).SetBytes(callContext.memory.GetPtr(int64(offset), 32)).Int64())
                        offset = offset + 32
                        temp = temp + core * data
                }
        }
        
        callContext.memory.Set32(0, big.NewInt(int64(temp)))
        return nil, nil
}
```

## 池化指令

``` go
func opPool(pc *uint64, interpreter *EVMInterpreter, callContext *callCtx) ([]byte, error){
        offset := 0
        pool_row := int(new(big.Int).SetBytes(callContext.memory.GetPtr(int64(offset), 32)).Int64())
        //offset = offset + 32 
        var max_val int = 0
        var i int
        for i = 0; i < pool_row * pool_row; i++ {
                core := int(new(big.Int).SetBytes(callContext.memory.GetPtr(int64(offset), 32)).Int64())
                if i==0 {
                        max_val = core
                }else{
                        if core > max_val{
                                max_val = core
                        }
                }
                offset = offset + 32
        }
        callContext.memory.Set32(0, big.NewInt(int64(max_val)))
        return nil, nil
}

```
