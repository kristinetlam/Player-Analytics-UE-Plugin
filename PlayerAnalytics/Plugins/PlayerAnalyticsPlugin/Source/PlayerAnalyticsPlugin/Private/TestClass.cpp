#include "TestClass.h"
#include "Misc/OutputDeviceDebug.h"


void UTestClass::PrintHelloWorld()
{
    UE_LOG(LogTemp, Warning, TEXT("Hello World! :D"));
}