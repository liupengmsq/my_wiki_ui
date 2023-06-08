<template>
  <div class="content">
    <div class="content__title">
      <b>用户登陆</b>
    </div>
    <div class="content__container">
      <div class="content__container__group">
        <div class="content__container__label">
          <label><b>用户名</b></label>
        </div>
        <input v-focus tabindex="1" v-model="username" class="content__container__input" type="text" placeholder="输入用户名"
          name="target" required>
      </div>

      <div class="content__container__group">
        <div class="content__container__label">
          <label><b>密码</b></label>
        </div>
        <input tabindex="2" v-model="password" class="content__container__input" type="password" placeholder="输入密码"
          name="title" required>
      </div>
    </div>

    <div class="content__btns">
      <div tabindex="3" class="content__btns__btn content__btns__btn--first" @click="confirm">确认</div>
      <div tabindex="4" class="content__btns__btn content__btns__btn--last" @click="cancel">取消</div>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue';
import { post } from '../../utils/request';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const confirm = async () => {
      if (username.value === '' || password.value === '')  {
        alert('用户名和密码不能为空！！');
        return;
      }

      const response = await post('/api/user/login', {
        'userName': username.value,
        'password': password.value
      })
      if (!response.Success) {
        alert(response?.Errors)
        return;
      }
      localStorage.jwtToken = response.Result['Authorization'];
      alert('登陆成功');
      router.push({ path: '/'});
    }

    return {
      username,
      password,
      confirm
    }
  }
}
</script>
  
<style lang="scss" scoped>
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  background: var(--dialog-backgroud-color);
  border-radius: .04rem;
  width: 5rem;

  &__title {
    margin: .24rem 0 0 0;
    line-height: .26rem;
    font-size: .18rem;
    color: var(--dialog-title-color);
    text-align: center;
  }

  &__desc {
    margin: .08rem 0 0 0;
    font-size: .14rem;
    color: #666;
    text-align: center;
  }

  &__container {
    margin: 0 .4rem .16rem .4rem; // 设置外边距，将input div挤到中间居中
    padding: 0 .16rem; // 设置内边距，将里面的输入框content与外面的input div留出距离

    &__group {
      margin-top: .2rem;
    }

    &__label {
      margin-bottom: .1rem;
    }

    &__input {
      width: 93%;
      margin-bottom: .2rem;
      padding: .12rem;
      border: .01rem solid #ccc;
      border-radius: .03rem;
    }
  }

  &__btns {
    display: flex;
    margin: .24rem .58rem;

    &__btn {
      cursor: pointer;
      flex: 1;
      width: .8rem;
      line-height: .32rem;
      text-align: center;

      &--first {
        margin-right: .12rem;
        background-color: var(--dialog-confirm-button-background-color);
        color: var(--dialog-confirm-button-color);
        transition-duration: 0.2s;
      }

      &--first:hover {
        background-color: #1c98f7;
      }

      &--last {
        margin-left: .12rem;
        border: .01rem solid #4FB0F9;
        background-color: var(--dialog-cancel-button-background-color);
        color: var(--dialog-cancel-button-color);
        transition-duration: 0.2s;
      }

      &--last:hover {
        color: #0091ff;
      }

    }
  }
}
</style>