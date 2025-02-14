// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

#include "UObject/GeneratedCppIncludes.h"
#include "PlayerAnalytics/PlayerAnalyticsGameMode.h"
PRAGMA_DISABLE_DEPRECATION_WARNINGS
void EmptyLinkFunctionForGeneratedCodePlayerAnalyticsGameMode() {}

// Begin Cross Module References
ENGINE_API UClass* Z_Construct_UClass_AGameModeBase();
PLAYERANALYTICS_API UClass* Z_Construct_UClass_APlayerAnalyticsGameMode();
PLAYERANALYTICS_API UClass* Z_Construct_UClass_APlayerAnalyticsGameMode_NoRegister();
UPackage* Z_Construct_UPackage__Script_PlayerAnalytics();
// End Cross Module References

// Begin Class APlayerAnalyticsGameMode
void APlayerAnalyticsGameMode::StaticRegisterNativesAPlayerAnalyticsGameMode()
{
}
IMPLEMENT_CLASS_NO_AUTO_REGISTRATION(APlayerAnalyticsGameMode);
UClass* Z_Construct_UClass_APlayerAnalyticsGameMode_NoRegister()
{
	return APlayerAnalyticsGameMode::StaticClass();
}
struct Z_Construct_UClass_APlayerAnalyticsGameMode_Statics
{
#if WITH_METADATA
	static constexpr UECodeGen_Private::FMetaDataPairParam Class_MetaDataParams[] = {
		{ "HideCategories", "Info Rendering MovementReplication Replication Actor Input Movement Collision Rendering HLOD WorldPartition DataLayers Transformation" },
		{ "IncludePath", "PlayerAnalyticsGameMode.h" },
		{ "ModuleRelativePath", "PlayerAnalyticsGameMode.h" },
		{ "ShowCategories", "Input|MouseInput Input|TouchInput" },
	};
#endif // WITH_METADATA
	static UObject* (*const DependentSingletons[])();
	static constexpr FCppClassTypeInfoStatic StaticCppClassTypeInfo = {
		TCppClassTypeTraits<APlayerAnalyticsGameMode>::IsAbstract,
	};
	static const UECodeGen_Private::FClassParams ClassParams;
};
UObject* (*const Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::DependentSingletons[])() = {
	(UObject* (*)())Z_Construct_UClass_AGameModeBase,
	(UObject* (*)())Z_Construct_UPackage__Script_PlayerAnalytics,
};
static_assert(UE_ARRAY_COUNT(Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::DependentSingletons) < 16);
const UECodeGen_Private::FClassParams Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::ClassParams = {
	&APlayerAnalyticsGameMode::StaticClass,
	"Game",
	&StaticCppClassTypeInfo,
	DependentSingletons,
	nullptr,
	nullptr,
	nullptr,
	UE_ARRAY_COUNT(DependentSingletons),
	0,
	0,
	0,
	0x008802ACu,
	METADATA_PARAMS(UE_ARRAY_COUNT(Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::Class_MetaDataParams), Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::Class_MetaDataParams)
};
UClass* Z_Construct_UClass_APlayerAnalyticsGameMode()
{
	if (!Z_Registration_Info_UClass_APlayerAnalyticsGameMode.OuterSingleton)
	{
		UECodeGen_Private::ConstructUClass(Z_Registration_Info_UClass_APlayerAnalyticsGameMode.OuterSingleton, Z_Construct_UClass_APlayerAnalyticsGameMode_Statics::ClassParams);
	}
	return Z_Registration_Info_UClass_APlayerAnalyticsGameMode.OuterSingleton;
}
template<> PLAYERANALYTICS_API UClass* StaticClass<APlayerAnalyticsGameMode>()
{
	return APlayerAnalyticsGameMode::StaticClass();
}
DEFINE_VTABLE_PTR_HELPER_CTOR(APlayerAnalyticsGameMode);
APlayerAnalyticsGameMode::~APlayerAnalyticsGameMode() {}
// End Class APlayerAnalyticsGameMode

// Begin Registration
struct Z_CompiledInDeferFile_FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsGameMode_h_Statics
{
	static constexpr FClassRegisterCompiledInInfo ClassInfo[] = {
		{ Z_Construct_UClass_APlayerAnalyticsGameMode, APlayerAnalyticsGameMode::StaticClass, TEXT("APlayerAnalyticsGameMode"), &Z_Registration_Info_UClass_APlayerAnalyticsGameMode, CONSTRUCT_RELOAD_VERSION_INFO(FClassReloadVersionInfo, sizeof(APlayerAnalyticsGameMode), 212599775U) },
	};
};
static FRegisterCompiledInInfo Z_CompiledInDeferFile_FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsGameMode_h_2316892791(TEXT("/Script/PlayerAnalytics"),
	Z_CompiledInDeferFile_FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsGameMode_h_Statics::ClassInfo, UE_ARRAY_COUNT(Z_CompiledInDeferFile_FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsGameMode_h_Statics::ClassInfo),
	nullptr, 0,
	nullptr, 0);
// End Registration
PRAGMA_ENABLE_DEPRECATION_WARNINGS
