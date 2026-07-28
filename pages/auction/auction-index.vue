<template>
  <div class="auction-process">
    <h2 class="process-title">竞拍流程</h2>
    <div class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="index" 
        class="step"
      >
        <div class="step-icon">
          <i :class="step.icon"></i>
        </div>
        <div class="step-text">{{ step.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuctionProcess',
  data() {
    return {
      steps: [
        { icon: 'fas fa-money-check-alt', text: '交保证金' },
        { icon: 'fas fa-gavel', text: '出价' },
        { icon: 'fas fa-trophy', text: '价高者得' },
        { icon: 'fas fa-clipboard-check', text: '确认订单' },
        { icon: 'fas fa-check-circle', text: '支付成功' },
        { icon: 'fas fa-box-open', text: '获得拍品' }
      ]
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

.auction-process {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 1000px;
  width: 100%;
}

.process-title {
  color: #d81e06;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.steps-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 20px 0;
}

/* 连接线 */
.steps-container::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 50px;
  right: 50px;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #d81e06;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  font-size: 30px;
  color: #d81e06;
}

.step-text {
  font-size: 16px;
  color: #333;
  text-align: center;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .steps-container {
    flex-direction: column;
    align-items: center;
  }
  
  .steps-container::before {
    display: none;
  }
  
  .step {
    margin-bottom: 30px;
    width: 100%;
  }
  
  .step-icon {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
}
</style>