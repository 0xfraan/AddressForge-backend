import { GolemNetwork, JobState } from '@golem-sdk/golem-js'


const golemClient = new GolemNetwork({
  yagna: {
    apiKey: 'try_golem',
  },
})

await golemClient
  .init()
  .then(() => {
    console.log('Connected to the Golem Network!')
  })
  .catch((error) => {
    console.error('Failed to connect to the Golem Network:', error)
    process.exit(1)
  })


    const job = golemClient.createJob({
      package: {
        imageTag: 'severyn/espeak:latest',
      },
    })
  
    job.events.on('created', () => {
      console.log('Job created')
    })
    job.events.on('started', () => {
      console.log('Job started')
    })
    job.events.on('error', () => {
      console.log('Job failed', job.error)
    })
    job.events.on('success', () => {
      console.log('Job succeeded', job.results)
    })
  
    job.startWork(async (ctx) => {
      const fileName = `${Math.random().toString(36).slice(2)}.wav`
      await ctx
        .beginBatch()
        .run(`espeak "${req.body}" -w /golem/output/output.wav`)
        .downloadFile('/golem/output/output.wav', `public/${fileName}`)
        .end()
      return fileName
    })
    res.send(`Job started! ID: ${job.id}`)

    
(async function main() {
  const executor = await TaskExecutor.create({
    package: "81fa6ef676b8953f8b7992f4e3df3401f0c63ec89c8e1d367e61a827",
    yagnaOptions: { apiKey: "try_golem" },
    capabilities: ["!exp:gpu"],
    engine: "vm-nvidia",
    subnetTag: "degenhack",
    activityPreparingTimeout: 1000 * 60 * 20, // 10 min
    taskTimeout: 1000 * 60 * 30 // 10 min
  });
  try {
    await executor.run(async (ctx) => console.log((await ctx.run("/createXcrunch/target/release/createxcrunch create3 --help")).stdout));
  } catch (error) {
    console.error("Computation failed:", error);
  } finally {
    await executor.shutdown();
  }
})();

