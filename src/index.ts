import { Elysia, t } from "elysia";
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

new Elysia()
  // .post(
  //   "/create2/:mode",
  //   ({ body }) => {
  //     return body
  //   },
  //   {
  //     params: t.Object({
  //       mode: t.String(),
  //     }),
  //     body: t.Object({
  //       address: t.String(),
  //       data: t.String(),
  //       initCodeHash: t.String(),
  //       factory: t.Optional(t.String()),
  //       chainId: t.Optional(t.Number()),
  //     }),
  //   }
  // )
  .post(
    "/create3/:mode",
    ({ body }) => {
      const job = golemClient.createJob({
        package: {
          imageHash: '198fc8a789b2fd0fd886147a23c7022323139fffc754b9633fff6f98',
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
        const resp = await ctx.run(`/golem/work/cxc/light create3 -c ${body.address} -z ${body.data} -f ${body.factory} -i ${body.chainId}`)
        return resp.stdout
      })
      return job.id
    },
    {
      params: t.Object({
        mode: t.String(),
      }),
      body: t.Object({
        address: t.String(),
        data: t.String(),
        factory: t.Optional(t.String()),
        chainId: t.Optional(t.Number()),
      }),
    }
  )
  .get('/:id/status', ({ params }) => {
    const job = golemClient.getJobById(params.id)
    if (!job) return 'not found'
    return job.state
  })
  .get('/:id/result', async ({ params }) => {
    const job = golemClient.getJobById(params.id)
    if (!job) return 'not found'
    if (job.state !== JobState.Done) {
      await job.waitForResult()
    }
    const results = await job.results
    // @ts-ignore
    return results.stdout.split('\n')
  })
  .listen(80);
