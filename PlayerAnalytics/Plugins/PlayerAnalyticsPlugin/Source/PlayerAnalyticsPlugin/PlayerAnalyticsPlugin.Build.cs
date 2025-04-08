// Copyright Epic Games, Inc. All Rights Reserved.

using UnrealBuildTool;

public class PlayerAnalyticsPlugin : ModuleRules
{
    public PlayerAnalyticsPlugin(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
        
        PublicIncludePaths.AddRange(
            new string[] {
                // ... add public include paths required here ...
            }
        );
                
        PrivateIncludePaths.AddRange(
            new string[] {
                // ... add other private include paths required here ...
            }
        );
        
        // Runtime dependencies (Valid for packaged builds)
        PublicDependencyModuleNames.AddRange(
            new string[]
            {
                "Core", 
                "Json", 
                "JsonUtilities",
                "CoreUObject",
                "Engine",
                "DeveloperSettings",
                "HTTP"
            }
        );
        
        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "Slate",
                "SlateCore"
            }
        );

        // Editor-only dependencies (Excluded from packaged builds)
        if (Target.bBuildEditor)
        {
            PrivateDependencyModuleNames.AddRange(
                new string[]
                {
                    "BlueprintGraph"
                }
            );
        }

        DynamicallyLoadedModuleNames.AddRange(
            new string[] {
                // ... add any modules that your module loads dynamically here ...
            }
        );
    }
}
