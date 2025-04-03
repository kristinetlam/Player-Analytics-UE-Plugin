#include "PlayerSpecs.h"


FString UPlatformFunctions::GetCPUBrandName()
{
	return FWindowsPlatformMisc::GetCPUBrand();
}

FString UPlatformFunctions::GetCPUVendorName()
{
	return FWindowsPlatformMisc::GetCPUVendor();
}

FString UPlatformFunctions::GetGPUBrandName()
{
	return FWindowsPlatformMisc::GetPrimaryGPUBrand();
}

int32 UPlatformFunctions::GetCPUCores()
{
	return FWindowsPlatformMisc::NumberOfCores();
}