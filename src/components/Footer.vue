<template>
  <footer class="footer nemesis-glass">
    <span>© NemesisNet 2025</span>
    <span style="margin-left: 12px">
      <a
        href="https://github.com/NemesisGuy"
        target="_blank"
        class="footer-link"
        title="GitHub"
      >
        <i class="fa-brands fa-github"></i> NemesisGuy
      </a>
    </span>
    <span style="margin-left: 12px">
      <a
        href="https://nemesisnet.co.za"
        target="_blank"
        class="footer-link"
        title="NemesisNet"
      >
        <i class="fa-solid fa-globe"></i> NemesisNet.co.za
      </a>
    </span>
  </footer>
</template>

<script setup>
// No script needed for static footer
</script>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(90deg, #23263a 0%, #4fd1c5 100%);
  color: #fff;
  text-align: center;
  padding: 12px 0 8px 0;
  font-size: 1rem;
  letter-spacing: 0.02em;
  opacity: 0.92;
  box-shadow: 0 -2px 16px #4fd1c533;
}
.nemesis-glass {
  backdrop-filter: blur(10px);
  border-radius: 0;
}
.footer-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.18s;
}
.footer-link:hover {
  color: #4fd1c5;
}
</style>
