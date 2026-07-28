<template>
  <div v-if="visible" class="cookie-consent">
    <div class="cookie-consent__content">
      <div class="cookie-consent__glow"></div>
      <div class="cookie-consent__text">
        <div class="cookie-consent__eyebrow">COOKIE</div>
        <div class="cookie-consent__title">
          <span class="cookie-consent__icon"></span>
          {{ $t('cookieConsent.title') }}
        </div>
        <div class="cookie-consent__desc">
          {{ $t('cookieConsent.desc') }}
        </div>
      </div>
      <div class="cookie-consent__actions">
        <el-button
          size="mini"
          class="cookie-consent__button cookie-consent__button--ghost"
          @click="reject"
        >
          {{ $t('cookieConsent.reject') }}
        </el-button>
        <el-button
          type="primary"
          size="mini"
          class="cookie-consent__button cookie-consent__button--primary"
          @click="accept"
        >
          {{ $t('cookieConsent.accept') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    }
  },
  mounted() {
    this.visible = this.$cookieConsent.shouldShowBanner()
    window.addEventListener(
      this.$cookieConsent.openSettingsEvent,
      this.handleOpenSettings
    )
  },
  beforeDestroy() {
    window.removeEventListener(
      this.$cookieConsent.openSettingsEvent,
      this.handleOpenSettings
    )
  },
  methods: {
    handleOpenSettings() {
      this.visible = true
    },
    accept() {
      this.updateConsent('accept')
    },
    reject() {
      this.updateConsent('reject')
    },
    updateConsent(value) {
      this.$cookieConsent.setStatus(value)
      this.visible = false
    },
  },
}
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 3000;
  pointer-events: none;
}

.cookie-consent__content {
  position: relative;
  overflow: hidden;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.64);
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.64)
  );
  box-shadow:
    0 14px 36px rgba(34, 20, 22, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(22px) saturate(145%);
  pointer-events: auto;
}

.cookie-consent__glow {
  position: absolute;
  top: -84px;
  right: 8px;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(180, 30, 46, 0.22) 0%,
    rgba(212, 40, 45, 0.16) 28%,
    rgba(178, 30, 46, 0.04) 56%,
    rgba(178, 30, 46, 0) 76%
  );
  pointer-events: none;
}

.cookie-consent__text {
  position: relative;
  color: #161616;
  line-height: 1.45;
  flex: 1;
  min-width: 0;
}

.cookie-consent__eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(178, 30, 46, 0.08);
  color: rgba(178, 30, 46, 0.78);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.cookie-consent__title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.cookie-consent__icon {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f0c46b, #b21e2e);
  box-shadow: 0 0 0 4px rgba(178, 30, 46, 0.1);
}

.cookie-consent__icon::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  box-shadow:
    4px 1px 0 0 rgba(255, 255, 255, 0.94),
    2px 5px 0 0 rgba(255, 255, 255, 0.94);
}

.cookie-consent__desc {
  max-width: 760px;
  margin-top: 5px;
  color: rgba(22, 22, 22, 0.68);
  font-size: 13px;
}

.cookie-consent__actions {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.cookie-consent__button {
  min-width: 112px;
  height: 34px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.cookie-consent__button:hover {
  transform: translateY(-1px);
}

.cookie-consent__button--ghost {
  border-color: rgba(178, 30, 46, 0.14);
  background: rgba(255, 255, 255, 0.46);
  color: #161616;
}

.cookie-consent__button--ghost:hover,
.cookie-consent__button--ghost:focus {
  border-color: rgba(178, 30, 46, 0.3);
  background: rgba(255, 255, 255, 0.76);
  color: #161616;
}

.cookie-consent__button--primary {
  border: none;
  background: linear-gradient(135deg, #b21e2e, #d4282d);
  box-shadow: 0 10px 20px rgba(178, 30, 46, 0.22);
}

.cookie-consent__button--primary:hover,
.cookie-consent__button--primary:focus {
  background: linear-gradient(135deg, #c32638, #df3a3f);
  box-shadow: 0 12px 24px rgba(178, 30, 46, 0.26);
}

@media (max-width: 768px) {
  .cookie-consent {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }

  .cookie-consent__content {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 14px;
    border-radius: 18px;
  }

  .cookie-consent__title {
    margin-top: 8px;
    font-size: 16px;
  }

  .cookie-consent__desc {
    font-size: 12px;
  }

  .cookie-consent__actions {
    justify-content: stretch;
  }

  .cookie-consent__button {
    flex: 1;
    min-width: 0;
  }
}
</style>
