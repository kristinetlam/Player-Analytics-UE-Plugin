   
              <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                  <Box sx={{ border: '1px solid #ddd', backgroundColor: '#fff', px: 2, py: 1, borderRadius: 1, width: '100%', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Title Here</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <CardComponent title="Average FPS" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '200px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageFPS /></CardComponent>
                  </Box>
                </Box>
              </Box>

                <CardComponent title="Environment Interaction" description="Quantifies player interactions with game elements" centerContent={true} > <PlayerInteractionsBarGraph /></CardComponent>
                <CardComponent title="Item Usage" description="Displays the distribution of player item usage" centerContent={true} pieBottom={true} ><BasicPie /></CardComponent>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                    <Box sx={{ border: '1px solid #ddd', backgroundColor: '#fff', px: 2, py: 1, borderRadius: 1, width: '100%', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Session & Retention Insights</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                      <CardComponent title="Player Session Statistics" description="Summarizes player session data with key metrics" sx={{ flex: '1 1 600px', maxWidth: '630px', minWidth: '400px' }} centerContent={true}><PlayerSessionStats /></CardComponent>
                      <CardComponent title="Average Session Length" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '240px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageSessionLength /></CardComponent>
                      <CardComponent title="Player Session Length" description="Illustrates player session lengths grouped by game version patches" centerContent={true}><SessionLineChart /></CardComponent>
                      <CardComponent title="Player Retention" description="Measures return rates based on last login timestamps" centerContent={true}><BasicLineChart /></CardComponent>
                      <CardComponent title="Average Player Return" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><Box sx={{ mt: '-40px' }}><GaugeChartComp /></Box></CardComponent>
                    </Box>
                  </Box>
                </Box>

                {/* Performance Trends Section */}
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Box sx={{ maxWidth: '1200px', mx: 'auto' }}> 
                    <Box sx={{ border: '1px solid #ddd', backgroundColor: '#fff', px: 2, py: 1, borderRadius: 1, width: '100%', mb: 2 }}> {/* Section title bar */}
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Performance Trends</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}> {/* Card row container */}
                      <CardComponent title="FPS Performance Scatterplot" description="Tracks frame rate patterns across multiple players and dates" centerContent={true}><FPSOverTime /></CardComponent>
                      <CardComponent title="Average FPS Timeline" description="Player FPS averages grouped by day over time" centerContent={true}><FPSLineChart /></CardComponent>
                    </Box>
                  </Box>
                </Box>

                <CardComponent title="Player Location" description="Visualizes player movement density across the game map" sx={{ width: '65%'}} centerContent={false}><ApexChart/></CardComponent>
