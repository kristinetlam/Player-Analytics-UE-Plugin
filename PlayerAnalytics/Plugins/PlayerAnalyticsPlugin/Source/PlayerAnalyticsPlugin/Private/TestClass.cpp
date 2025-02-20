#include "TestClass.h"
#include "Misc/OutputDeviceDebug.h"


void UTestClass::PrintHelloWorld()
{
    UE_LOG(LogTemp, Warning, TEXT("Hello World! :D"));
}

void UTestClass::PrintHelloWorld2()
{
    UE_LOG(LogTemp, Warning, TEXT("This is a second test node."));
}