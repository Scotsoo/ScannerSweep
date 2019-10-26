<template>
  <div>
    <b-button @click="popToast">Show Toast with custom content</b-button>
  </div>
</template>

<script>
  export default {
    name: 'Toast',
    data() {
      return {
        count: 0
      }
    },
    methods: {

      /*
          Config:
              variant: 'info'| 'warning' | 'success' | 'primary'
              noautohide : true | false
              delay: integer (ms)
      */
      popToast(config) {
        // Use a shorter name for this.$createElement
        const h = this.$createElement

        config = config | {}

        // Increment the toast count
        this.count++
        // Create the message
        const vNodesMsg = h(
          'p',
          { class: ['text-center', 'mb-0'] },
          [
            h('b-spinner', { props: { type: 'grow', small: true } }),
            ' Flashy ',
            h('strong', {}, 'toast'),
            ` message #${this.count} `,
            h('b-spinner', { props: { type: 'grow', small: true } })
          ]
        )
        // Create the title
        const vNodesTitle = h(
          'div',
          { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
          [
            // h('strong', { class: 'mr-2' }, 'The Title'),
            h('img', { class: 'dale', src: '../assets/dale.png', style: 'width: 10vh'}),
            // h('small', { class: 'ml-auto text-italics' }, '5 minutes ago')
          ]
        )
        // Pass the VNodes as an array for message and title
        this.$bvToast.toast([vNodesMsg], {
          toaster: 'b-toaster-bottom-center',
          title: [vNodesTitle],
          solid: true,
          noAutoHide: config.noautohide || true,
          autoHideDelay : config.delay || 1000,
          variant: config.primary || 'primary'
        })
      }
    }
 }
</script>
