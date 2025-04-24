#include "Misc/AutomationTest.h"
#include "Tests/AutomationCommon.h"
#include "PlayerDataHandler.h"
#include "PlayerData.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddInteractionTest,
    "PlayerDataHandler.AddInteraction",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddInteractionTest::RunTest(const FString& Parameters)
{
    // Arrange
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    FString Description = TEXT("Opened Chest");
    FVector Location(100.f, 200.f, 300.f);

    // Act
    Handler->AddInteraction(Description, Location);

    // Assert
    const auto& Interactions = Handler->playerData->interactions;
    TestEqual(TEXT("One interaction should be recorded"), Interactions.Num(), 1);

    if (Interactions.Num() > 0)
    {
        const auto& Interaction = Interactions[0];
        TestEqual(TEXT("Description should match"), Interaction.InteractionDescription, Description);
        TestEqual(TEXT("Location should match"), Interaction.InteractionLocation, Location);
    }

    return true;
}


IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddPositionTest,
    "PlayerDataHandler.AddPosition",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddPositionTest::RunTest(const FString& Parameters)
{
    // Arrange
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    FVector TestPosition(150.f, 75.f, 30.f);

    // Act
    Handler->AddPosition(TestPosition);

    // Assert
    const auto& Positions = Handler->playerData->positions;
    TestEqual(TEXT("One position should be recorded"), Positions.Num(), 1);

    if (Positions.Num() > 0)
    {
        const auto& PositionData = Positions[0];
        TestEqual(TEXT("Position vector should match"), PositionData.Position, TestPosition);
    }

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddAVGfpsTest,
    "PlayerDataHandler.AddAVGfps",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddAVGfpsTest::RunTest(const FString& Parameters)
{
    // Arrange
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    int TestFPS = 87;

    // Act
    Handler->AddAVGfps(TestFPS);

    // Assert
    const auto& FPSData = Handler->playerData->AvgFPSPoints;
    TestEqual(TEXT("One FPS data point should be recorded"), FPSData.Num(), 1);

    if (FPSData.Num() > 0)
    {
        const auto& DataPoint = FPSData[0];
        TestEqual(TEXT("FPS value should match"), DataPoint.AverageFPS, TestFPS);
    }

    return true;
}
