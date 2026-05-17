## Tricks

### ipdb

ipdb是一个IPython的python下debug神器，支持在代码中添加断点，进行单步调试
安装: `pip install ipdb`

```python
import ipdb
x=0
ipdb.set_trace()
print(x)
y=30
print(y)
```
