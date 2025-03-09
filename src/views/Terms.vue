<template>
  <div class="terms">
    <div class="terms-header">
      <h1>{{ $t("terms.title") }}</h1>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{
          $t("nav.home")
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t("terms.title") }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="terms-content">
      <el-card>
        <h2>{{ $t("terms.welcome") }}</h2>
        <p>{{ $t("terms.introduction") }}</p>

        <h3>1. {{ $t("terms.acceptance.title") }}</h3>
        <p>{{ $t("terms.acceptance.content") }}</p>

        <h3>2. {{ $t("terms.registration.title") }}</h3>
        <p>{{ $t("terms.registration.content") }}</p>

        <h3>3. {{ $t("terms.privacy.title") }}</h3>
        <p>{{ $t("terms.privacy.content") }}</p>

        <h3>4. {{ $t("terms.products.title") }}</h3>
        <p>{{ $t("terms.products.content") }}</p>

        <h3>5. {{ $t("terms.orders.title") }}</h3>
        <p>{{ $t("terms.orders.content") }}</p>

        <h3>6. {{ $t("terms.payment.title") }}</h3>
        <p>{{ $t("terms.payment.content") }}</p>

        <h3>7. {{ $t("terms.shipping.title") }}</h3>
        <p>{{ $t("terms.shipping.content") }}</p>

        <h3>8. {{ $t("terms.returns.title") }}</h3>
        <p>{{ $t("terms.returns.content") }}</p>

        <h3>9. {{ $t("terms.disclaimer.title") }}</h3>
        <p>{{ $t("terms.disclaimer.content") }}</p>

        <h3>10. {{ $t("terms.contact.title") }}</h3>
        <p>{{ $t("terms.contact.content") }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<style scoped>
.terms {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.terms-header {
  margin-bottom: 20px;
}

.terms-header h1 {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.terms-content {
  margin-bottom: 40px;
}

.terms-content h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 20px;
}

.terms-content h3 {
  font-size: 18px;
  color: #333;
  margin: 30px 0 15px;
}

.terms-content p {
  margin: 0 0 15px;
  line-height: 1.6;
  color: #666;
}

@media (max-width: 768px) {
  .terms {
    padding: 10px;
  }

  .terms-header h1 {
    font-size: 20px;
  }

  .terms-content h2 {
    font-size: 18px;
  }

  .terms-content h3 {
    font-size: 16px;
  }
}
</style>
