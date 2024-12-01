
- [发版记录](https://xiaomi.f.mioffice.cn/docs/dock4E1ct5WP0nHUZ8n05o1DLF3#)
- [Readme](https://xiaomi.f.mioffice.cn/docs/dock4JOjmG9pnBVI21HGEtHtnhf)

## API
```cpp
// 1.声明实例
HISClassPtr his = newHISAlgo(path.c_str(), "conf.yaml");
// 2.开始stream
hisStartStream(his, dumpPath.c_str());
// 3.获取sensor数据
status = (SC)hisAddGyro(his, gT, gx, gy, gz);
status = (SC)hisAddAcc(his, ax, ay, az, aT)
status = (SC)hisAddOISHall(his, hT, hX, hY);
// 4.获取frame
hisInformNewFrame(his, time, exposureTime,
                  zoom, gain, gridFrmCropFctrH,
                  gridFrmCropFctrV, id, idNorm);
status = hisInquireSensorDataRangeForFrame(his, time, exposureTime, zoom,
                                           gain, gridFrmCropFctrH,
                                           gridFrmCropFctrV, id,idNorm,
                                 	 	   restGyroRangeFrom,restGyroRangeTo,
                                  		   restHallRangeFrom,restHallRangeTo)
// 5.结束stream
hisStopStream(his);
// 6.析构实例
delHISAlgo(his);

// 获取版本号
char version[100];
hisGetVersion(his, version);
cout << "HIS Version: " << version << endl;
```

status
```cpp
//means addFrame is successful, user could get the grid from gridPixTarget
case HIS_STATUS_OK:

//means not enough GYRO data to decide how to warp this frame , user need to add more recent GYRO in this case.
case HIS_STATUS_NOT_ENOUGH_GYRO1_ORIENTATION_NOT_INIT:
case HIS_STATUS_NOT_ENOUGH_GYRO2_AT_ORIGINAL_ORIENTATION_ALLOCATION:
case HIS_STATUS_NOT_ENOUGH_GYRO3_AT_FILTERED_ORIENTATION_ALLOCATION:

//means not enough OIS(HALL) data to decide how to warp this frame , user need to add more recent OIS(HALL) in this case.
case HIS_STATUS_NOT_ENOUGH_OISHALL1_HAL_NOT_INIT:
case HIS_STATUS_NOT_ENOUGH_OISHALL2_FOR_THIS_FRAME_DUR:
case HIS_STATUS_NOT_ENOUGH_OISHALL3_FOR_FUTURE_PREDICTION:

//means not enough face information to do prediction
//means it's too late for system calling addFace, the Queue inside Algorithm has been overflow
//this situation should never happen, since by default, algorithm has already take in count 500ms late delivery
case HIS_STATUS_NOT_ENOUGH_FACE_FOR_FUTURE_PREDICTION:
case HIS_STATUS_FRAME_OLD_USEFUL_FACE_HAS_BEEN_OVERWRITTEN:

//means not enough Acc data to decide how to level this frame, user need to add more recent Acc in this case.
case HIS_STATUS_NOT_ENOUGH_SENSORACC_ORIENTATION_NOT_INIT:
case HIS_STATUS_NOT_ENOUGH_SENSORACC_AT_ORIGINAL_ORIENTATION_ALLOCATION:

//means it's too late for system calling addFrame, the Queue inside Algorithm has been overflow
//this situation should never happen, since by default, algorithm has already take in count 500ms late delivery
case HIS_STATUS_FRAME_OLD_USEFUL_ORIENTATION_HAS_BEEN_OVERWRITTEN:
```

## The pseudo-code

```
if (recording_mode)
{
    // Init the HIS Algo.
    HISClassPtr his = newHISAlgo(path.c_str(), "recording_conf.yaml");
    // After the initialization is completed, it is called once every time the recording starts.
    hisStartStream(his, dumpPath.c_str());

    // Get version of the HIS Algo.
    char version[100];
    hisGetVersion(his, version);


    1. Suppose that at the moment of 0ms, the first frame of data comes

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.



    2. At the moment of 33.33ms, the second frame of data cames:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.

    ......




    3. At the moment of 1000ms, the 30th frame of data comes:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.



    31. At the moment of 1033.33ms, the 31th frame of data comes:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.

    Next, call hisAddFrame() and pass in the frame data of the first frame at 0ms.



    32. At the moment of 1066.66ms, the 32th frame of data comes:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.

    Next, call hisAddFrame() and pass in the frame data of the 2th frame at 33.33ms.



    33. And so on...



    34. Assuming to stop recording at the 300th frame, call hisShowHandForFrames() at this moment

        Next, call hisAddFrame() and pass in the frame data of the 271th frame.
        Next, call hisAddFrame() and pass in the frame data of the 272th frame.
        Next, call hisAddFrame() and pass in the frame data of the 273th frame.

        ......
        Next, call hisAddFrame() and pass in the frame data of the 298th frame.
        Next, call hisAddFrame() and pass in the frame data of the 299th frame.
        Next, call hisAddFrame() and pass in the frame data of the 300th frame.

    // Immediately call once every time you stop recording.
    hisStopStream(his);
｝


if (preview_mode)
{
    // Init the HIS Algo.
    HISClassPtr his = newHISAlgo(path.c_str(), "preview_conf.yaml");
    // Called once after initialization is complete
    hisStartStream(his, dumpPath.c_str());

    // Get version of the HIS Algo.
    char version[100];
    hisGetVersion(his, version);

    1. Suppose that at the moment of 0ms, the 1th frame of data comes:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }


    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.

    Next, call hisAddFrame() and pass in the frame data of the 1th frame at 0ms.



    2. Suppose that at the moment of 33.33ms, the 2th frame of data comes:

    Call hisInquireSensorDataRangeForFrame() to get the timestamp range of GYRO and HALL

    if （selfie ON）
    {
        Call hisInformNewFrame()
        Call hisSelfieAddFace()
    }
    else
    {
        Call hisInformNewFrame()
    }

    Call hisAddOISHall() in a loop, giving all the data within the HALL timestamp range.
    if (HorizonMode ON)
    {
        Call hisAddAcc() in a loop, giving all the data within the GYRO timestamp range.
    }
    Call hisAddGyro() in a loop, giving all the data within the GYRO timestamp range.

    Next, call hisAddFrame() and pass in the frame data of the 2th frame at 33.33ms.


    3. And so on...

    // Immediately call once when exiting the camera.
    hisStopStream(his);
｝
```

```cpp
SC status = HIS_STATUS_OK;
gettimeofday( &start, NULL );
// 1. prepare frame
status = (SC)hisInformNewFrame(this->displayHis, metadata.timestamp, metadata.exp_time, 1.0, 1.0,
                               0.2, 0.2, static_cast<int64_t>( pRequest->mRequestNo), static_cast<int64_t>( pRequest->mRequestNo));
// 2. prepare sensor data
gettimeofday( &aaa, NULL );
auto processingTime_aaa = 1000 * ( aaa.tv_sec - start.tv_sec ) + (aaa.tv_usec - start.tv_usec) / 1000;

for (int i=0; i<vGyroData.size(); i++) {
    status = (SC)hisAddGyro(this->displayHis, vGyroData[i].timestamp, vGyroData[i].x,  vGyroData[i].y,  vGyroData[i].z);
    if (status!=HIS_STATUS_OK)
        MY_LOGE("hisAddGyro failed");
}
gettimeofday( &bbb, NULL );
auto processingTime_bbb = 1000 * ( bbb.tv_sec - start.tv_sec ) + (bbb.tv_usec - start.tv_usec) / 1000;

// 3. do algo-process
float apiGridTarget[2 * 35 * 27] {};
float apiGridRSCFrameMid[2 * 35 * 27] {};
double apiPerspectMatrixRSC2LastFrameRSC[3][3] {};
double apiPerspectMatrixMidFrmRSC2Stab[3][3] {};

status = (SC)hisAddFrame(this->displayHis, metadata.timestamp, metadata.exp_time,
                         1.0, 1.0, 0.2, 0.2, static_cast<int64_t>( pRequest->mRequestNo),
                         static_cast<int64_t>( pRequest->mRequestNo), apiGridTarget,
                         apiGridRSCFrameMid, apiPerspectMatrixRSC2LastFrameRSC, apiPerspectMatrixMidFrmRSC2Stab);
gettimeofday( &ccc, NULL );
auto processingTime_ccc = 1000 * ( ccc.tv_sec - start.tv_sec ) + (ccc.tv_usec - start.tv_usec) / 1000;

if (HIS_STATUS_OK == status)
    genWarpMap(apiGridRSCFrameMid, outWarp, inSize, usage);
else {
    MY_LOGE("hisProcess hisAddFrame failed %d", status);
}
MY_LOGD("matao HyperIS Processing time: %ld/%ld/%ld", processingTime_aaa, processingTime_bbb, processingTime_ccc);
```