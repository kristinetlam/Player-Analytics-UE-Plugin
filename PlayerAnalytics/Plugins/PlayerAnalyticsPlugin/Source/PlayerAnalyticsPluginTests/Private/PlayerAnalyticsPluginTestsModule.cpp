#include "Modules/ModuleManager.h"

class FPlayerAnalyticsPluginTestsModule : public IModuleInterface
{
public:
    virtual void StartupModule() override {}
    virtual void ShutdownModule() override {}
};

IMPLEMENT_MODULE(FPlayerAnalyticsPluginTestsModule, PlayerAnalyticsPluginTests)
