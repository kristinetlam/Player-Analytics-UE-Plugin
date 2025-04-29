using UnrealBuildTool;

public class PlayerAnalyticsPluginTests : ModuleRules
{
    public PlayerAnalyticsPluginTests(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;

        PrivateDependencyModuleNames.AddRange(new string[]
        {
            "Core",
            "CoreUObject",
            "Engine",
            "AutomationTest",
            "PlayerAnalyticsPlugin" // Include your main plugin module
        });
    }
}