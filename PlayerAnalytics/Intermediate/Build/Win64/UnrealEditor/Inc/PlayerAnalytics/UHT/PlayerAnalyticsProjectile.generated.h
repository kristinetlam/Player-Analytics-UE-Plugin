// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

// IWYU pragma: private, include "PlayerAnalyticsProjectile.h"
#include "UObject/ObjectMacros.h"
#include "UObject/ScriptMacros.h"

PRAGMA_DISABLE_DEPRECATION_WARNINGS
class AActor;
class UPrimitiveComponent;
struct FHitResult;
#ifdef PLAYERANALYTICS_PlayerAnalyticsProjectile_generated_h
#error "PlayerAnalyticsProjectile.generated.h already included, missing '#pragma once' in PlayerAnalyticsProjectile.h"
#endif
#define PLAYERANALYTICS_PlayerAnalyticsProjectile_generated_h

#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_RPC_WRAPPERS_NO_PURE_DECLS \
	DECLARE_FUNCTION(execOnHit);


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_INCLASS_NO_PURE_DECLS \
private: \
	static void StaticRegisterNativesAPlayerAnalyticsProjectile(); \
	friend struct Z_Construct_UClass_APlayerAnalyticsProjectile_Statics; \
public: \
	DECLARE_CLASS(APlayerAnalyticsProjectile, AActor, COMPILED_IN_FLAGS(0 | CLASS_Config), CASTCLASS_None, TEXT("/Script/PlayerAnalytics"), NO_API) \
	DECLARE_SERIALIZER(APlayerAnalyticsProjectile) \
	static const TCHAR* StaticConfigName() {return TEXT("Game");} \



#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_ENHANCED_CONSTRUCTORS \
private: \
	/** Private move- and copy-constructors, should never be used */ \
	APlayerAnalyticsProjectile(APlayerAnalyticsProjectile&&); \
	APlayerAnalyticsProjectile(const APlayerAnalyticsProjectile&); \
public: \
	DECLARE_VTABLE_PTR_HELPER_CTOR(NO_API, APlayerAnalyticsProjectile); \
	DEFINE_VTABLE_PTR_HELPER_CTOR_CALLER(APlayerAnalyticsProjectile); \
	DEFINE_DEFAULT_CONSTRUCTOR_CALL(APlayerAnalyticsProjectile) \
	NO_API virtual ~APlayerAnalyticsProjectile();


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_12_PROLOG
#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_GENERATED_BODY \
PRAGMA_DISABLE_DEPRECATION_WARNINGS \
public: \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_RPC_WRAPPERS_NO_PURE_DECLS \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_INCLASS_NO_PURE_DECLS \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h_15_ENHANCED_CONSTRUCTORS \
private: \
PRAGMA_ENABLE_DEPRECATION_WARNINGS


template<> PLAYERANALYTICS_API UClass* StaticClass<class APlayerAnalyticsProjectile>();

#undef CURRENT_FILE_ID
#define CURRENT_FILE_ID FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsProjectile_h


PRAGMA_ENABLE_DEPRECATION_WARNINGS
