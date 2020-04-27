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

## 矩阵操作

由于Golang源生语言不含有矩阵类操作，因此采用[goNum包](https://github.com/chfenger/goNum/blob/master/Matrix.go)进行开发

常用函数：

+ 创建新矩阵 `func NewMatrix(r, c int, data []float64) Matrix {}`
+ 获取指定值 `func (A *Matrix) GetFromMatrix(r, c int) float64 {}`
+ 矩阵加 `func AddMatrix(A, B Matrix) Matrix {}`
+ 矩阵减 `func SubMatrix(A, B Matrix) Matrix {}`
+ 数乘 `func NumProductMatrix(A Matrix, c float64) Matrix {}`
+ 点乘 `func DotPruduct(A, B Matrix) Matrix {}`
