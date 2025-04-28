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

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddInventoryTest,
    "PlayerDataHandler.AddInventory",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddInventoryTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    TArray<FString> ItemNames = { TEXT("Sword"), TEXT("Shield") };
    TArray<int> ItemAmounts = { 1, 2 };
    int Size = 2, Capacity = 10;

    Handler->AddInventory(Size, Capacity, ItemNames, ItemAmounts);

    const auto& Inventories = Handler->playerData->Inventories;
    TestEqual(TEXT("One inventory should be recorded"), Inventories.Num(), 1);
    if (Inventories.Num() > 0)
    {
        const auto& Inventory = Inventories[0];
        TestEqual(TEXT("Inventory size should match"), Inventory.Size, Size);
        TestEqual(TEXT("First item name should match"), Inventory.Items[0].ItemName, TEXT("Sword"));
        TestEqual(TEXT("Second item amount should match"), Inventory.Items[1].Amount, 2);
    }

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddSessionTest,
    "PlayerDataHandler.AddSession",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddSessionTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();

    FString SessionName = TEXT("TestSession");
    FString Start = TEXT("12:00");
    FString End = TEXT("12:30");
    FString Type = TEXT("Normal");

    Handler->AddSession(SessionName, Start, End, Type);

    const auto& Sessions = Handler->playerData->Sessions;
    TestEqual(TEXT("One session should be recorded"), Sessions.Num(), 1);
    if (Sessions.Num() > 0)
    {
        const auto& Session = Sessions[0];
        TestEqual(TEXT("Session name should match"), Session.SessionName, SessionName);
        TestEqual(TEXT("EndType should match"), Session.EndType, Type);
    }

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddUiInteractionTest,
    "PlayerDataHandler.AddUiInteraction",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddUiInteractionTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();

    Handler->AddUiInteraction(TEXT("InventoryButton"), TEXT("Click"));

    const auto& Interactions = Handler->playerData->uiInteractions;
    TestEqual(TEXT("One UI interaction should be recorded"), Interactions.Num(), 1);
    if (Interactions.Num() > 0)
    {
        const auto& Data = Interactions[0];
        TestEqual(TEXT("Element name should match"), Data.UIElementName, TEXT("InventoryButton"));
        TestEqual(TEXT("Action type should match"), Data.ActionType, TEXT("Click"));
    }

    return true;
}


IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddScreenVisitTest,
    "PlayerDataHandler.AddScreenVisit",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddScreenVisitTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();

    Handler->AddScreenVisit(TEXT("MainMenu"), 3.5f);

    const auto& Visits = Handler->playerData->screenVisits;
    TestEqual(TEXT("One screen visit should be recorded"), Visits.Num(), 1);
    if (Visits.Num() > 0)
    {
        const auto& Visit = Visits[0];
        TestEqual(TEXT("Screen name should match"), Visit.ScreenName, TEXT("MainMenu"));
        TestEqual(TEXT("Duration should match"), Visit.Duration, 3.5f);
    }

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddMemoryTest,
    "PlayerDataHandler.AddMemory",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddMemoryTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    Handler->AddMemory();
    TestEqual(TEXT("Memory data recorded"), Handler->playerData->MemoryPoints.Num(), 1);
    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddCPUUsageTest,
    "PlayerDataHandler.AddCPUUsage",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddCPUUsageTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    Handler->AddCPUUsage();
    TestEqual(TEXT("CPU usage recorded"), Handler->playerData->CPUPoints.Num(), 1);
    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FAddMomentTest,
    "PlayerDataHandler.AddMoment",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FAddMomentTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    FVector Pos(1.f, 2.f, 3.f);
    Handler->AddMoment(Pos, TEXT("50%"), TEXT("400MB"), TEXT("60"));

    const auto& Moments = Handler->playerData->Moments;
    TestEqual(TEXT("One moment should be recorded"), Moments.Num(), 1);
    if (Moments.Num() > 0)
    {
        const auto& M = Moments[0];
        TestEqual(TEXT("Position should match"), M.Position, Pos);
        TestEqual(TEXT("CPU string should match"), M.CPU, TEXT("50%"));
    }

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FUpdatePlayerHealthTest,
    "PlayerDataHandler.UpdatePlayerHealth",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FUpdatePlayerHealthTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    Handler->UpdatePlayerHealth(77);
    TestEqual(TEXT("Health value updated"), Handler->playerData->playerHealth, 77);
    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FSaveToJSONTest,
    "PlayerDataHandler.SaveToJSON",
    EAutomationTestFlags::EditorContext | EAutomationTestFlags::EngineFilter)

    bool FSaveToJSONTest::RunTest(const FString& Parameters)
{
    UPlayerDataHandler* Handler = NewObject<UPlayerDataHandler>();
    FString FilePath = Handler->SaveToJSON();

    TestTrue(TEXT("Returned filename should end with .json"), FilePath.EndsWith(TEXT(".json")));

    // Optionally: check if file exists
    FString FullPath = FPaths::ProjectSavedDir() + FilePath;
    bool bExists = FPaths::FileExists(FullPath);
    TestTrue(TEXT("Saved file should exist on disk"), bExists);

    return true;
}
