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
                // Removed "BlueprintGraph" from here
            }
        );
            
        PrivateDependencyModuleNames.AddRange(
            new string[]
            {
                "Slate",
                "SlateCore",
                // ... add private dependencies that you statically link with here ...    
            }
        );

        // Only include editor dependencies when building for the editor
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
            new string[]
            {
                // ... add any modules that your module loads dynamically here ...
            }
        );
    }
}
