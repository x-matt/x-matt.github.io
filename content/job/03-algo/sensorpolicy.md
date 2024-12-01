### 文件目录架构

1. so
	1. `libmiSATTranslate.so`
	2. `libcom.xiaomi.sensorpolicy.so`
	3. `libmiSAT.so`
2. cpp

| 文件                      | 作用            | 主要函数                                                                           | LOG TAG        |
| ----------------------- | ------------- | ------------------------------------------------------------------------------ | -------------- |
| sensorpolicy            |               | - `configureStreams()`<br>- `getAllCameraInfo()`<br>- `prepareISZConfigData()` |                |
| midecision              | 分为SAT & Bokeh |                                                                                | `BOKEH_POLICY` |
| optical_zoom_translator |               |                                                                                |                |
| sat_sensor_control      |               |                                                                                |                |
|                         |               |                                                                                |                |

![[sensorpolicy 2024-10-10 15.14.45.excalidraw]]

3. core emun
	 > PlatformInfoType.h

	```cpp
	typedef enum {
	    CameraRoleDefault,
	    CameraRoleUltraWide,  // UW
	    CameraRoleWide,       // W 
	    CameraRoleTele,       // T
	    CameraRoleTele4X,     // UT
	    CameraRoleMax
	} CameraRoleType;
	```
4.  function logic
- Policy
	- MiSatDecision::decideActiveSensor()
		- sensorControl->**process()**
	- decideSensorCropRegion()
	- decideSensor3ARegion()
	- decideSensorStatus()
	- MiSatDecision::decideSensorModeType()
		- sensorControl->processBokehSensorModeType
		- sensorControl->**processSensorModeType()**