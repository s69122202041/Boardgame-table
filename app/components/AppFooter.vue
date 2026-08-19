<template>
  <footer class="site-footer">
    <div class="container footer-content">

      <div class="footer-brand">
        <div class="footer-logo">
          🎲
        </div>

        <div>
          <strong>Boardgame table</strong>

          <p>
            PLAY • THINK • CONNECT
          </p>
        </div>
      </div>

      <div class="footer-info">
        <span>
          Frontend Demo
        </span>

        <span>•</span>

        <span>
          Nuxt 3
        </span>

        <span>•</span>

        <span>
          Mock Data
        </span>
      </div>

      <div class="footer-math">
        <strong>
          Discrete Mathematics
        </strong>

        <span>
          Set · Function · Logic
        </span>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 80px;

  background: var(--color-primary);
  color: white;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 32px;

  padding: 36px 0;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  display: grid;
  place-items: center;

  width: 44px;
  height: 44px;

  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.footer-brand strong {
  display: block;
}

.footer-brand p {
  margin: 4px 0 0;

  color: #cfc5bb;

  font-size: 0.7rem;
  letter-spacing: 0.12em;
}

.footer-info,
.footer-math {
  display: flex;
  align-items: center;
  gap: 8px;

  color: #cfc5bb;

  font-size: 0.85rem;
}

.footer-math {
  flex-direction: column;
  align-items: flex-end;
}

.footer-math strong {
  color: white;
}

@media (max-width: 800px) {
  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-math {
    align-items: flex-start;
  }
}
</style>