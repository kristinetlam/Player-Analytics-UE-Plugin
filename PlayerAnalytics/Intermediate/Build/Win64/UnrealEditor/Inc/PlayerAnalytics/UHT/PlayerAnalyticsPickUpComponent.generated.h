// Copyright Epic Games, Inc. All Rights Reserved.
/*===========================================================================
	Generated code exported from UnrealHeaderTool.
	DO NOT modify this manually! Edit the corresponding .h files instead!
===========================================================================*/

// IWYU pragma: private, include "PlayerAnalyticsPickUpComponent.h"
#include "UObject/ObjectMacros.h"
#include "UObject/ScriptMacros.h"

PRAGMA_DISABLE_DEPRECATION_WARNINGS
class AActor;
class APlayerAnalyticsCharacter;
class UPrimitiveComponent;
struct FHitResult;
#ifdef PLAYERANALYTICS_PlayerAnalyticsPickUpComponent_generated_h
#error "PlayerAnalyticsPickUpComponent.generated.h already included, missing '#pragma once' in PlayerAnalyticsPickUpComponent.h"
#endif
#define PLAYERANALYTICS_PlayerAnalyticsPickUpComponent_generated_h

#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_12_DELEGATE \
PLAYERANALYTICS_API void FOnPickUp_DelegateWrapper(const FMulticastScriptDelegate& OnPickUp, APlayerAnalyticsCharacter* PickUpCharacter);


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_RPC_WRAPPERS_NO_PURE_DECLS \
	DECLARE_FUNCTION(execOnSphereBeginOverlap);


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_INCLASS_NO_PURE_DECLS \
private: \
	static void StaticRegisterNativesUPlayerAnalyticsPickUpComponent(); \
	friend struct Z_Construct_UClass_UPlayerAnalyticsPickUpComponent_Statics; \
public: \
	DECLARE_CLASS(UPlayerAnalyticsPickUpComponent, USphereComponent, COMPILED_IN_FLAGS(0 | CLASS_Config), CASTCLASS_None, TEXT("/Script/PlayerAnalytics"), NO_API) \
	DECLARE_SERIALIZER(UPlayerAnalyticsPickUpComponent)


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_ENHANCED_CONSTRUCTORS \
private: \
	/** Private move- and copy-constructors, should never be used */ \
	UPlayerAnalyticsPickUpComponent(UPlayerAnalyticsPickUpComponent&&); \
	UPlayerAnalyticsPickUpComponent(const UPlayerAnalyticsPickUpComponent&); \
public: \
	DECLARE_VTABLE_PTR_HELPER_CTOR(NO_API, UPlayerAnalyticsPickUpComponent); \
	DEFINE_VTABLE_PTR_HELPER_CTOR_CALLER(UPlayerAnalyticsPickUpComponent); \
	DEFINE_DEFAULT_CONSTRUCTOR_CALL(UPlayerAnalyticsPickUpComponent) \
	NO_API virtual ~UPlayerAnalyticsPickUpComponent();


#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_14_PROLOG
#define FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_GENERATED_BODY \
PRAGMA_DISABLE_DEPRECATION_WARNINGS \
public: \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_RPC_WRAPPERS_NO_PURE_DECLS \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_INCLASS_NO_PURE_DECLS \
	FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h_17_ENHANCED_CONSTRUCTORS \
private: \
PRAGMA_ENABLE_DEPRECATION_WARNINGS


template<> PLAYERANALYTICS_API UClass* StaticClass<class UPlayerAnalyticsPickUpComponent>();

#undef CURRENT_FILE_ID
#define CURRENT_FILE_ID FID_Users_Brack_Tamu_Capstone_Player_Analytics_UE_Plugin_PlayerAnalytics_Source_PlayerAnalytics_PlayerAnalyticsPickUpComponent_h


PRAGMA_ENABLE_DEPRECATION_WARNINGS
