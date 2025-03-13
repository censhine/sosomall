<template>
  <div class="support-ticket">
    <div class="ticket-header">
      <h3>{{ $t('support.ticket') }}</h3>
      <el-button type="primary" @click="showNewTicketForm = true">
        {{ $t('support.createTicket') }}
      </el-button>
    </div>

    <!-- 工单列表 -->
    <div class="ticket-list" v-if="tickets.length > 0">
      <el-card v-for="ticket in tickets" :key="ticket.id" class="ticket-item">
        <div class="ticket-info">
          <div class="ticket-subject">
            <span class="ticket-id">#{{ ticket.id }}</span>
            <span class="ticket-title">{{ ticket.subject }}</span>
            <el-tag :type="getStatusType(ticket.status)" size="small">
              {{ $t(`support.status.${ticket.status}`) }}
            </el-tag>
          </div>
          <div class="ticket-meta">
            <span>{{ formatDate(ticket.createdAt) }}</span>
            <span>{{ $t('support.lastUpdate') }}: {{ formatDate(ticket.updatedAt) }}</span>
          </div>
          <div class="ticket-preview">{{ ticket.content }}</div>
        </div>
        <div class="ticket-actions">
          <el-button link @click="viewTicket(ticket)">
            {{ $t('support.viewDetails') }}
          </el-button>
        </div>
      </el-card>
    </div>

    <div v-else class="no-tickets">
      {{ $t('support.noTickets') }}
    </div>

    <!-- 新建工单对话框 -->
    <el-dialog
      v-model="showNewTicketForm"
      :title="$t('support.createTicket')"
      width="60%"
    >
      <el-form
        ref="ticketForm"
        :model="newTicket"
        :rules="ticketRules"
        label-width="100px"
      >
        <el-form-item :label="$t('support.subject')" prop="subject">
          <el-input v-model="newTicket.subject" />
        </el-form-item>

        <el-form-item :label="$t('support.type')" prop="type">
          <el-select v-model="newTicket.type" style="width: 100%">
            <el-option
              v-for="type in ticketTypes"
              :key="type"
              :label="$t(`support.types.${type}`)"
              :value="type"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('support.priority')" prop="priority">
          <el-select v-model="newTicket.priority" style="width: 100%">
            <el-option
              v-for="priority in priorities"
              :key="priority"
              :label="$t(`support.priorities.${priority}`)"
              :value="priority"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('support.content')" prop="content">
          <el-input
            v-model="newTicket.content"
            type="textarea"
            :rows="6"
          />
        </el-form-item>

        <el-form-item :label="$t('support.attachments')">
          <el-upload
            action="/api/upload"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            multiple
            :limit="5"
          >
            <el-button type="primary">
              {{ $t('support.uploadFiles') }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                {{ $t('support.uploadTip') }}
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showNewTicketForm = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitTicket">
          {{ $t('support.submit') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 工单详情对话框 -->
    <el-dialog
      v-if="currentTicket"
      v-model="showTicketDetail"
      :title="`${$t('support.ticketDetail')} #${currentTicket.id}`"
      width="70%"
    >
      <div class="ticket-detail">
        <div class="ticket-detail-header">
          <h4>{{ currentTicket.subject }}</h4>
          <el-tag :type="getStatusType(currentTicket.status)">
            {{ $t(`support.status.${currentTicket.status}`) }}
          </el-tag>
        </div>

        <div class="ticket-messages">
          <div
            v-for="message in currentTicket.messages"
            :key="message.id"
            class="message-item"
            :class="{ 'message-staff': message.isStaff }"
          >
            <div class="message-header">
              <span class="message-author">
                {{ message.isStaff ? message.staffName : $t('support.you') }}
              </span>
              <span class="message-time">{{ formatDate(message.createdAt) }}</span>
            </div>
            <div class="message-content">{{ message.content }}</div>
            <div v-if="message.attachments?.length" class="message-attachments">
              <div
                v-for="attachment in message.attachments"
                :key="attachment.id"
                class="attachment-item"
              >
                <el-link :href="attachment.url" target="_blank">
                  {{ attachment.name }}
                </el-link>
              </div>
            </div>
          </div>
        </div>

        <div class="reply-form" v-if="currentTicket.status !== 'closed'">
          <el-input
            v-model="replyMessage"
            type="textarea"
            :rows="4"
            :placeholder="$t('support.replyPlaceholder')"
          />
          <div class="reply-actions">
            <el-upload
              action="/api/upload"
              :on-success="handleReplyUploadSuccess"
              :on-error="handleUploadError"
              multiple
              :limit="5"
            >
              <el-button>
                {{ $t('support.attachFiles') }}
              </el-button>
            </el-upload>
            <el-button type="primary" @click="submitReply">
              {{ $t('support.reply') }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate as formatDateUtil } from '@/utils/date'

interface Ticket {
  id: number
  subject: string
  type: string
  priority: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  content: string
  createdAt: string
  updatedAt: string
  messages: TicketMessage[]
  attachments?: Attachment[]
}

interface TicketMessage {
  id: number
  content: string
  isStaff: boolean
  staffName?: string
  createdAt: string
  attachments?: Attachment[]
}

interface Attachment {
  id: number
  name: string
  url: string
}

const tickets = ref<Ticket[]>([])
const showNewTicketForm = ref(false)
const showTicketDetail = ref(false)
const currentTicket = ref<Ticket | null>(null)
const replyMessage = ref('')

const ticketTypes = ['general', 'technical', 'billing', 'product']
const priorities = ['low', 'medium', 'high', 'urgent']

const newTicket = reactive({
  subject: '',
  type: 'general',
  priority: 'medium',
  content: '',
  attachments: []
})

const ticketRules = {
  subject: [{ required: true, message: 'Please enter subject', trigger: 'blur' }],
  type: [{ required: true, message: 'Please select type', trigger: 'change' }],
  priority: [{ required: true, message: 'Please select priority', trigger: 'change' }],
  content: [{ required: true, message: 'Please enter content', trigger: 'blur' }]
}

const formatDate = (date: string) => {
  return formatDateUtil(date)
}

const getStatusType = (status: Ticket['status']) => {
  const statusMap = {
    open: 'info',
    in_progress: 'warning',
    resolved: 'success',
    closed: ''
  }
  return statusMap[status]
}

const handleUploadSuccess = (response: any) => {
  newTicket.attachments.push({
    id: response.data.id,
    name: response.data.name,
    url: response.data.url
  })
}

const handleReplyUploadSuccess = (response: any) => {
  // 处理回复上传附件
}

const handleUploadError = () => {
  ElMessage.error('Upload failed')
}

const submitTicket = async () => {
  // 提交工单逻辑
}

const viewTicket = (ticket: Ticket) => {
  currentTicket.value = ticket
  showTicketDetail.value = true
}

const submitReply = async () => {
  // 提交回复逻辑
}

// 初始加载工单列表
const loadTickets = async () => {
  // 加载工单列表逻辑
}

loadTickets()
</script>

<style scoped>
.support-ticket {
  padding: 20px;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ticket-item {
  cursor: pointer;
}

.ticket-info {
  margin-bottom: 12px;
}

.ticket-subject {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.ticket-id {
  color: var(--el-text-color-secondary);
}

.ticket-title {
  font-weight: bold;
  flex: 1;
}

.ticket-meta {
  display: flex;
  gap: 16px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  margin-bottom: 8px;
}

.ticket-preview {
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.no-tickets {
  text-align: center;
  color: var(--el-text-color-secondary);
  padding: 40px;
}

.ticket-detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.ticket-detail-header h4 {
  margin: 0;
  flex: 1;
}

.ticket-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.message-item {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
}

.message-item.message-staff {
  background-color: var(--el-color-primary-light-9);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.message-author {
  font-weight: bold;
}

.message-time {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.message-attachments {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.reply-form {
  border-top: 1px solid var(--el-border-color);
  padding-top: 20px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}
</style>