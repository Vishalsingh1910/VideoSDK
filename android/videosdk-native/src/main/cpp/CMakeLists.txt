cmake_minimum_required(VERSION 3.22.1)
project("videosdk")

set(CMAKE_CXX_STANDARD 17)

# Set the OpenCV path relative to CMakeLists.txt
set(OpenCV_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../../../opencv-sdk/sdk/native/jni)
find_package(OpenCV REQUIRED)

add_library(
        videosdk
        SHARED
        native-lib.cpp)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../../opencv-sdk/sdk/native/jni/include)

# Link OpenCV, Android native logging, and basic Android libraries
target_link_libraries(
        videosdk
        ${OpenCV_LIBS}
        android
        log)
