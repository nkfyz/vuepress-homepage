# Lenet5的基本内容

## 网络结构

Lenet5的基本网络结构:

+ 输入层 __INPUT层__
  - 图片大小 `32×32`
+ 卷积层 __C1层__
  - 输入大小 `32×32`
  - 卷积核大小 `5×5`
  - 卷积核种类 `6`
  - 步长 `1`
  - 输出的Feature Map大小 `28×28×6`
+ 池化层 __S2层__
  - 输入大小 `28×28`, 共循环 `6` 次
  - 采样区域 `2×2`
  - 采样方式 `4个输入相加，乘以一个可训练参数，再加上一个可训练偏置，结果通过Sigmoid函数`
  - 输出大小 `14×14×6`
+ 卷积层 __C3层__
  - 输入大小 `14×14×6`
  - 输出大小 `10×10×16`
  - 前6个特征图 与S2层相连的3个Feature Map相连接
  - 后6个特征图 与S2层相连的4个Feature Map相连接
  - 后3个特征图 与S2层部分不相连的4个Feature Map相连接
  - 后1个特征图 与S2层的所有Feature Map相连
+ 池化层 __S4层__
  - 输入大小 `10×10×16`
  - 采样区域 `2×2`
  - 采样方式 `4个输入相加，乘以一个可训练参数，再加上一个可训练偏置，结果通过Sigmoid函数`
  - 输出大小 `5×5×16`
+ 卷积层 __C5层__
  - 输入大小 `S4层的全部16个单元Feature Map`
  - 卷积核大小 `5×5`
  - 卷积核种类 `120`
  - 输出大小 `1×1×120`
+ 全连接层 __F6层__
  - 计算输入向量和权重向量之间的点积，再加上一个偏置，结果通过sigmoid函数输出。
+ 全连接层 __F7层__
  - 输出结果
  
## 主要算子提取

### 卷积

1. 将原始数据边缘补0 (Padding)
2. 卷积核与原始数据的对应位相乘后相加
3. 滑动步长Stride

### 池化

1. 最大、最小及平均采样

### Sigmoid函数

### 
