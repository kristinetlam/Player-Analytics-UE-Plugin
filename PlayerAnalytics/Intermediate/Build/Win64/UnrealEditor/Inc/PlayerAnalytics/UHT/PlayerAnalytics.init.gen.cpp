// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "UObject/GeneratedCppIncludes.h"
PRAGMA_DISABLE_DEPRECATION_WARNINGS
void EmptyLinkFunctionForGeneratedCodePlayerAnalytics_init() {}
	PLAYERANALYTICS_API UFunction* Z_Construct_UDelegateFunction_PlayerAnalytics_OnPickUp__DelegateSignature();
	static FPackageRegistrationInfo Z_Registration_Info_UPackage__Script_PlayerAnalytics;
	FORCENOINLINE UPackage* Z_Construct_UPackage__Script_PlayerAnalytics()
	{
		if (!Z_Registration_Info_UPackage__Script_PlayerAnalytics.OuterSingleton)
		{
			static UObject* (*const SingletonFuncArray[])() = {
				(UObject* (*)())Z_Construct_UDelegateFunction_PlayerAnalytics_OnPickUp__DelegateSignature,
			};
			static const UECodeGen_Private::FPackageParams PackageParams = {
				"/Script/PlayerAnalytics",
				SingletonFuncArray,
				UE_ARRAY_COUNT(SingletonFuncArray),
				PKG_CompiledIn | 0x00000000,
				0xC0510B42,
				0x7BE9A543,
				METADATA_PARAMS(0, nullptr)
			};
			UECodeGen_Private::ConstructUPackage(Z_Registration_Info_UPackage__Script_PlayerAnalytics.OuterSingleton, PackageParams);
		}
		return Z_Registration_Info_UPackage__Script_PlayerAnalytics.OuterSingleton;
	}
	static FRegisterCompiledInInfo Z_CompiledInDeferPackage_UPackage__Script_PlayerAnalytics(Z_Construct_UPackage__Script_PlayerAnalytics, TEXT("/Script/PlayerAnalytics"), Z_Registration_Info_UPackage__Script_PlayerAnalytics, CONSTRUCT_RELOAD_VERSION_INFO(FPackageReloadVersionInfo, 0xC0510B42, 0x7BE9A543));
PRAGMA_ENABLE_DEPRECATION_WARNINGS
