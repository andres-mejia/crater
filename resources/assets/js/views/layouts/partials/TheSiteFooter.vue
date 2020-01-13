<template>
  <footer class="site-footer">
    <div class="text-right">
      {{ $t('general.powered_by') }}
      <a
        href="https://www.pfstech.es/"
        target="_blank">
        <img src="/assets/img/logo-pfstech.png" alt="PFS TECH" class="logo-footer" />
      </a>
    </div>
  </footer>
</template>

<script type="text/babel">
export default {
  data () {
    return {
      footer: 'footer'
    }
  }
}
</script>
