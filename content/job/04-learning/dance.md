## Question

### 问答题
1. 设计C++函数传参时如何决定使用指针还是引用？ 
	- 指针和引用的差异
	- 实际中，为了表达的高效，基本都会用引用，数组/链表/树等数据结构时候就必须的用指针
1. 构造函数和析构函数可不可以是虚函数？为什么？
	- 构造函数不可以是虚函数，构造函数在先，vTable在后，然后本身就是依赖构造函数来表征这个对象的，所以在namespace，这个object是唯一的，构造函数赋予的唯一性
	- 析构函数可以是虚函数，动态完成对class的析构
1. camera子系统架构分层 
	1. app
	2. fwk
	3. hal
	4. kernel
### 编程题 
1. 给定一个二维整数数组 Image 和一个正整数 k表示Region的大小。请实现一个函数，找到在Image中，所有大小为k x k的Region中pixel数据总和最大的窗口的起始位置（行和列的索引）。考虑时间复杂度
	```cpp
	#include <iostream>
	#include <vector>
	#include <climits>
	
	std::pair<int, int> maxSumRegion(const std::vector<std::vector<int>>& image, int k) {
	    int rows = image.size();
	    int cols = image[0].size();
	    // 构建前缀和数组
	    std::vector<std::vector<int>> prefixSum(rows + 1, std::vector<int>(cols + 1, 0));
	    for (int i = 1; i <= rows; ++i) {
	        for (int j = 1; j <= cols; ++j) {
	            prefixSum[i][j] = image[i-1][j-1] +
	                              prefixSum[i-1][j] +
	                              prefixSum[i][j-1] -
	                              prefixSum[i-1][j-1];
	        }
	    }
	
	    int maxSum = INT_MIN;
	    std::pair<int, int> topLeft = {0, 0};
	    // 使用前缀和数组计算 k x k 区域的和
	    for (int i = k; i <= rows; ++i) {
	        for (int j = k; j <= cols; ++j) {
	            int sum = prefixSum[i][j] -
	                      prefixSum[i-k][j] -
	                      prefixSum[i][j-k] +
	                      prefixSum[i-k][j-k];
	            if (sum > maxSum) {
	                maxSum = sum;
	                topLeft = {i-k, j-k};
	            }
	        }
	    }
	    return topLeft;
	}
	
	int main() {
	    std::vector<std::vector<int>> image = {
	        {1, 2, 3, 4},
	        {5, 6, 7, 8},
	        {9, 10, 11, 12},
	        {13, 14, 15, 16}
	    };
	
	    int k = 2;
	    auto result = maxSumRegion(image, k);
	    std::cout << "biggest is: (" << result.first << ", " << result.second << ")" << std::endl;
	
	    return 0;
	}
	```
1. 计算5x5的图像矩阵的标准差来评估其噪声水平
    {12, 56, 34, 23, 45},
    {34, 67, 23, 56, 78},
    {56, 78, 90, 34, 12},
    {78, 34, 23, 56, 67},
    {90, 56, 34, 23, 12}
    ```cpp
    #include <iostream>
	#include <vector>
	#include <cmath>
	
	// 计算均值
	double calculateMean(const std::vector<std::vector<int>>& matrix) {
	    double sum = 0;
	    int count = 0;
	    for (const auto& row : matrix) {
	        for (int val : row) {
	            sum += val;
	            count++;
	        }
	    }
	    return sum / count;
	}
	
	// 计算标准差
	double calculateStandardDeviation(const std::vector<std::vector<int>>& matrix, double mean) {
	    double variance = 0;
	    int count = 0;
	    for (const auto& row : matrix) {
	        for (int val : row) {
	            variance += (val - mean) * (val - mean);
	            count++;
	        }
	    }
	    return std::sqrt(variance / count);
	}
	
	int main() {
	    std::vector<std::vector<int>> matrix = {
	        {12, 56, 34, 23, 45},
	        {34, 67, 23, 56, 78},
	        {56, 78, 90, 34, 12},
	        {78, 34, 23, 56, 67},
	        {90, 56, 34, 23, 12}
	    };
	
	    double mean = calculateMean(matrix);
	    double stddev = calculateStandardDeviation(matrix, mean);
	
	    std::cout << "图像矩阵的均值: " << mean << std::endl;
	    std::cout << "图像矩阵的标准差: " << stddev << std::endl;
	
	    return 0;
	}
	```
1. 在 Camera 整个软件栈中，多线程需要配合执行， 请使用 mutex / condition variables / thread 实现以下内容：
	创建3个线程，
		线程1 的任务是负责打印 1
		线程2 的任务是负责打印 2
		线程3 的任务是负责打印 3
	请让三个线程按照顺序打印 123，连续打印**3**次后，整个进程退出。
	```cpp
	#include <iostream>
	#include <thread>
	#include <condition_variable>
	#include <mutex>
	
	std::mutex mtx;
	std::condition_variable cv;
	int count = 1;
	
	void print (int jobId, int num)
	{
		for (int i=0; i<3; i++) {
			std::unique_lock<std::mutex> lc (mtx);
			cv.wait(lc, [jobId] {return count == jobId;});
			std::cout << num;
			count = (count % 3) + 1;
			cv.notify_all();
		}
	};
	
	int main ()
	
	{
		std::thread t1(print, 1, 1);
		std::thread t2(print, 2, 2);
		std::thread t3(print, 3, 3);
	
		t1.join();
		t2.join();
		t3.join();
	
		std::cout << std::endl;
		return 0;
	}
	```
1. yuv420打印旋转
	```cpp
	#include <iostream>
	#include <fstream>
	
	void rotateYUV42090(unsigned char *src, unsigned char *dst, int width, int height) {
		int frameSize = width * height;
		int i, j;
	
		// Rotate Y
		for(i = 0; i < height; i++) {
			for(j = 0; j < width; j++) {
				dst[j * height + height - i - 1] = src[i * width + j];
			}
		}
	
		// Rotate U and V
		for(i = 0; i < height / 2; i++) {
			for(j = 0; j < width / 2; j++) {
				dst[frameSize + j * (height / 2) + (height / 2 - i - 1)] = src[frameSize + i * (width / 2) + j];
				dst[frameSize + (frameSize / 4) + j * (height / 2) + (height / 2 - i - 1)] = src[frameSize + (frameSize / 4) + i * (width / 2) + j];
			}
		}
	}
	
	int main() {
		int width = 640; // Replace with your image width
		int height = 480; // Replace with your image height
	
		std::ifstream infile("input.yuv", std::ios::binary);
		std::ofstream outfile("output.yuv", std::ios::binary);
	
		if (!infile.is_open() || !outfile.is_open()) {
			std::cerr << "Error opening file!" << std::endl;
			return 1;
		}
	
		int frameSize = width * height * 3 / 2;
		unsigned char *srcBuffer = new unsigned char[frameSize];
		unsigned char *dstBuffer = new unsigned char[frameSize];
	
		infile.read(reinterpret_cast<char*>(srcBuffer), frameSize);
		rotateYUV42090(srcBuffer, dstBuffer, width, height);
		outfile.write(reinterpret_cast<char*>(dstBuffer), frameSize);
	
		delete[] srcBuffer;
		delete[] dstBuffer;
	
		infile.close();
		outfile.close();
	
		return 0;
	}
	```
	
1. 写一个生产者消费者，一个产生0-100随机数，一个打印
	```cpp
	#include <iostream>
	#include <thread>
	#include <queue>
	#include <mutex>
	#include <condition_variable>
	#include <cstdlib>
	#include <ctime>
	
	std::queue<int> dataQueue;
	std::mutex mtx;
	std::condition_variable cv;
	bool done = false;
	
	void producer() {
	    std::srand(std::time(0));
	    for (int i = 0; i < 10; ++i) {
	        std::unique_lock<std::mutex> lock(mtx);
	        int num = std::rand() % 101;
	        dataQueue.push(num);
	        std::cout << "Produced: " << num << std::endl;
	        cv.notify_all();
	        lock.unlock();
	        std::this_thread::sleep_for(std::chrono::milliseconds(100));
	    }
	    {
	        std::unique_lock<std::mutex> lock(mtx);
	        done = true;
	        cv.notify_all();
	    }
	}
	
	void consumer() {
	    while (true) {
	        std::unique_lock<std::mutex> lock(mtx);
	        cv.wait(lock, [] { return !dataQueue.empty() || done; });
	        while (!dataQueue.empty()) {
	            int num = dataQueue.front();
	            dataQueue.pop();
	            std::cout << "Consumed: " << num << std::endl;
	        }
	        if (done && dataQueue.empty()) {
	            break;
	        }
	    }
	}
	
	int main() {
	    std::thread t1(producer);
	    std::thread t2(consumer);
	
	    t1.join();
	    t2.join();
	
	    return 0;
	}
	```