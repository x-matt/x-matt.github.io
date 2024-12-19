#!/bin/bash

# 获取当前目录中的所有 .png 和 .jpeg 文件
files=$(find . -type f \( -name "*.png" -o -name "*.jpeg" -o -name "*.jpg" \))

# 遍历每一个图片文件
for file in $files; do
    # 获取文件的目录路径和文件名（不带扩展名）
    dir=$(dirname "$file")
    filename=$(basename "$file")
    filename_no_ext="${filename%.*}"
    
    # 构造输出文件的路径
    output_file="$dir/$filename_no_ext.webp"
    
    # 调用 cwebp 命令进行转换
    cwebp -z 6 "$file" -o "$output_file"
done

echo "convert finished!"