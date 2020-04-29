<template>
  <div>
    <img src="../../assets/logo.png" height="60" width="60" alt="logo"/>
    <div v-if="!requestSent">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(changePassword)" role="form" style="margin-top: 20px">

            <ValidationProvider v-if="showToken" name="Token" rules="required" v-slot="{ errors }">
              <base-input  alternative
                          v-model="ltoken"
                          class="mb-3 modal-input"
                          :placeholder="$t('labels.token')"
                          addon-left-icon="ni ni-key-25"
                          :error="errors[0]">
              </base-input>
            </ValidationProvider>

            <ValidationObserver>
              <ValidationProvider v-if="!showToken" :name="$t('labels.oldPassword')" rules="required" v-slot="{ errors }">
                <base-input v-if="!showToken" alternative
                            v-model="loldpassword"
                            type="password"
                            class="modal-input"
                            :placeholder="$t('labels.oldPassword')"
                            addon-left-icon="ni ni-lock-circle-open"
                              :error="errors[0]">
                </base-input>
              </ValidationProvider>

              <ValidationProvider :name="$t('labels.password')" :rules="'required'+ (!showToken ? '|passwordDifferent:@'+$t('labels.oldPassword') : '')" v-slot="{ errors }">
                <base-input alternative
                            v-model="lpassword"
                            type="password"
                            class="modal-input"
                            :placeholder="$t('labels.newPassword')"
                            addon-left-icon="ni ni-lock-circle-open"
                              :error="errors[0]">
                </base-input>
              </ValidationProvider>

              <ValidationProvider :name="$t('labels.passwordConfirmation')" :rules="'required|passwordConfirm:@'+$t('labels.password')" v-slot="{ errors }">
                <base-input alternative
                            v-model="lpasswordconfirm"
                            type="password"
                            class="modal-input"
                            :placeholder="$t('labels.passwordConfirm')"
                            addon-left-icon="ni ni-lock-circle-open"
                              :error="errors[0]">
                </base-input>
              </ValidationProvider>
            </ValidationObserver>

            <div class="text-center my-2">
                <base-button v-if="!loading" type="orange" nativeType="submit" class="btn-orange">{{ $t('buttons.confirm') }}</base-button>
                <button v-else class="btn btn-orange" type="button" disabled>
                  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                  {{ $t('buttons.loading') }}
                </button>
            </div>
            <div v-if="errorMsg" class="text-center red">
              {{ errorMsg }}
            </div>
        </form>
      </ValidationObserver>
    </div>

    <div v-else>
      <div class="text-center my-4" style="margin-top: 20px">
        <p :class="success ? 'green': 'red'">{{ success ? $t('labels.passwordChanged') : $t('labels.passwordChangedError') }} <i class="far fa-check-circle"></i></p>
      </div>
    </div>

    <button class="btn btn-link btn-link-orange" v-if="!loading" @click="$emit('rollback')">{{ $t('buttons.cancel') }}</button>
  </div>
</template>
<script>
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import { createI18n } from '../../i18n/index'
const i18n = createI18n();

extend('required', required);
extend('passwordConfirm', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: i18n.t('labels.passwordConfirmationError')
});
extend('passwordDifferent', {
  params: ['target'],
  validate(value, { target }) {
    return value !== target
  },
  message: i18n.t('labels.passwordSame')
})

export default {
  data() {
    return {
      ltoken: '',
      loldpassword: '',
      lpassword: '',
      lpasswordconfirm: '',
      requestSent: false,
      message: '',
      success: false
    }
  },
  props: {
    errorMsg: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    showToken: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    changePassword() {
      this.$emit('changePassword', { password: this.lpassword, oldPassword: this.loldpassword, token: this.ltoken })
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if(mutation.type === 'changepass_success') {
        this.requestSent = true;
        this.success = true
      }
      if (mutation.type === 'auth_error') {
        this.success = false
      }
    })
  },
}
</script>
