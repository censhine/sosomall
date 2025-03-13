<template>
  <div class="campaign-page">
    <div class="campaign-header" :style="{ backgroundImage: `url(${campaign.headerImage})` }">
      <h1>{{ campaign.title }}</h1>
      <div class="campaign-timer" v-if="campaign.endTime">
        <countdown :time="getTimeRemaining()" v-slot="{ days, hours, minutes, seconds }">
          {{ $t('marketing.timeRemaining', { days, hours, minutes, seconds }) }}
        </countdown>
      </div>
    </div>

    <div class="campaign-content">
      <div class="campaign-description" v-html="campaign.description"></div>

      <div class="campaign-products" v-if="campaign.products?.length">
        <h2>{{ $t('marketing.featuredProducts') }}</h2>
        <div class="product-grid">
          <product-card
            v-for="product in campaign.products"
            :key="product.id"
            :product="product"
            :show-campaign-price="true"
          />
        </div>
      </div>

      <div class="campaign-rules" v-if="campaign.rules">
        <h3>{{ $t('marketing.rules') }}</h3>
        <div class="rules-content" v-html="campaign.rules"></div>
      </div>

      <div class="campaign-share">
        <h3>{{ $t('marketing.share') }}</h3>
        <div class="share-options">
          <div class="qr-code">
            <img :src="qrCodeUrl" :alt="$t('marketing.scanToShare')" />
            <span>{{ $t('marketing.scanToShare') }}</span>
          </div>
          <div class="share-links">
            <el-button
              v-for="platform in sharePlatforms"
              :key="platform.id"
              :icon="platform.icon"
              @click="shareToPlatform(platform.id)"
            >
              {{ platform.name }}
            </el-button>
          </div>
        </div>
        <div class="affiliate-link" v-if="isAffiliate">
          <h4>{{ $t('marketing.affiliateLink') }}</h4>
          <el-input
            v-model="affiliateLink"
            readonly
            :placeholder="$t('marketing.copyLink')"
          >
            <template #append>
              <el-button @click="copyLink">{{ $t('marketing.copy') }}</el-button>
            </template>
          </el-input>
          <div class="commission-info">
            {{ $t('marketing.commissionRate') }}: {{ campaign.commissionRate }}%
          </div>
        </div>
      </div>
    </div>

    <div class="campaign-footer" v-if="campaign.relatedCampaigns?.length">
      <h3>{{ $t('marketing.moreCampaigns') }}</h3>
      <div class="campaign-cards">
        <campaign-card
          v-for="relatedCampaign in campaign.relatedCampaigns"
          :key="relatedCampaign.id"
          :campaign="relatedCampaign"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/product/ProductCard.vue'
import CampaignCard from './CampaignCard.vue'
import { useUserStore } from '@/stores/user'
import { generateQRCode, generateAffiliateLink } from '@/utils/marketing'
import type { Campaign, SharePlatform } from '@/types/marketing'

const props = defineProps<{
  campaign: Campaign
}>()

const userStore = useUserStore()
const qrCodeUrl = ref('')
const affiliateLink = ref('')
const isAffiliate = ref(false)

const sharePlatforms: SharePlatform[] = [
  { id: 'wechat', name: 'WeChat', icon: 'wechat' },
  { id: 'weibo', name: 'Weibo', icon: 'weibo' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'twitter', name: 'Twitter', icon: 'twitter' }
]

const getTimeRemaining = () => {
  if (!props.campaign.endTime) return 0
  return new Date(props.campaign.endTime).getTime() - Date.now()
}

const shareToPlatform = async (platform: string) => {
  try {
    // 实现社交平台分享逻辑
    ElMessage.success($t('marketing.shareSuccess'))
  } catch (error) {
    ElMessage.error($t('marketing.shareFailed'))
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(affiliateLink.value)
    .then(() => ElMessage.success($t('marketing.copySuccess')))
    .catch(() => ElMessage.error($t('marketing.copyFailed')))
}

const initializeShare = async () => {
  // 生成二维码
  qrCodeUrl.value = await generateQRCode(window.location.href)

  // 如果用户是推广员，生成推广链接
  if (userStore.user?.isAffiliate) {
    isAffiliate.value = true
    affiliateLink.value = await generateAffiliateLink({
      campaignId: props.campaign.id,
      userId: userStore.user.id
    })
  }
}

onMounted(() => {
  initializeShare()
})
</script>

<style scoped>
.campaign-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.campaign-header {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 20px;
  margin-bottom: 30px;
}

.campaign-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}

.campaign-header h1 {
  position: relative;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.campaign-timer {
  position: relative;
  font-size: 1.2em;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  border-radius: 4px;
}

.campaign-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.campaign-description {
  margin-bottom: 30px;
  line-height: 1.6;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.campaign-rules {
  margin: 30px 0;
  padding: 20px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
}

.campaign-share {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.share-options {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.qr-code img {
  width: 150px;
  height: 150px;
}

.share-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.affiliate-link {
  margin-top: 20px;
}

.commission-info {
  margin-top: 10px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.campaign-footer {
  margin-top: 40px;
}

.campaign-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
</style>