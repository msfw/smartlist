<template>
  <div>
    <img src="../../assets/logo.png" height="60" width="60" alt="logo"/>

    <div v-if="!showEmailSent" >
      <div class="text-center  mb-4" v-show="false">
          <small>{{ $t('labels.loginModalDescription') }}</small>
      </div>
      <ValidationObserver v-slot="{ handleSubmit }">

        <form @submit.prevent="handleSubmit(forgotPassword)" role="form" style="margin-top: 20px">
          <ValidationProvider :name="$t('labels.name')" rules="required" v-slot="{ errors }">
            <base-input alternative
                        v-model="lemail"
                        class="mb-3 modal-input"
                        :placeholder="$t('labels.email')"
                        addon-left-icon="ni ni-email-83"
                      :error="errors[0]">
            </base-input>
          </ValidationProvider>
          <div class="text-center my-2 ">
              <base-button v-if="!loading" type="orange" nativeType="submit" class="btn-orange form-control">{{ $t('buttons.sendMail') }}</base-button>
              <button v-else class="btn btn-orange form-control" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                {{ $t('buttons.loading') }}
              </button>
          </div>
          <div v-if="errorMsg" class="text-center red">
            {{ errorMsg }}
          </div>
        </form>
      </ValidationObserver>

      <button class="btn btn-link btn-link-orange" v-if="!loading" @click="$emit('close')">{{ $t('buttons.backToLogin') }}</button>
    </div>

    <div v-else>
      <div class="text-center my-4" style="margin-top: 20px">
        <p class="green">{{ emailSentMessage }} <i class="far fa-check-circle"></i></p>
      </div>
      <button class="btn btn-link btn-link-orange" v-if="!loading" @click="$emit('newPassword')">{{ $t('buttons.backToLogin') }}</button>
    </div>
  </div>
</template>
<script>
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

extend('email', email);
extend('required', required);
export default {
  data() {
    return {
      lemail: '',
      showEmailSent: false,
      emailSentMessage: ''
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
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if(mutation.type === 'forgotpass_success') {
        this.showEmailSent = true;
        this.emailSentMessage = mutation.payload.data;
      }
    })
  },
  methods: {
    forgotPassword() {
      this.$emit('forgotPassword', { email: this.lemail})
    }
  },
}
</script>
