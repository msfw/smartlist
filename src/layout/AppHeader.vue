<template>
  <div>
    <div class="wrapper">
        <!-- Sidebar  -->
        <nav id="sidebar">
            <div id="dismiss" @click="dismiss">
                <i class="fas fa-arrow-left"></i>
            </div>

            <div class="sidebar-header">
              <img src="../assets/logo.png" height="60" width="60" alt="logo"/>
                <h3>Smart List</h3>
            </div>

            <ul class="list-unstyled components">
                <p v-if="isAuthenticated">Bem vindo, {{ $store.getters.getUserName }}</p>

                <p v-if="!isAuthenticated">{{ $t('labels.loginDescription') }}</p>

                <li v-if="!isAuthenticated">
                    <a href="#" @click="modal.visible = true">{{ $t('buttons.login') }}</a>
                </li>


                <li v-if="isAuthenticated">
                    <a href="#" @click="changePasswordButton()">{{ $t('buttons.changePassword') }}</a>
                </li>

                <li class="active" v-if="false">
                    <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false">Home</a>
                    <ul class="collapse list-unstyled" id="homeSubmenu">
                        <li>
                            <a href="#">Home 1</a>
                        </li>
                    </ul>
                </li>
                <li v-if="false">
                    <a href="#">Settings</a>
                </li>
            </ul>

            <ul class="list-unstyled CTAs" v-if="isAuthenticated">
                <li>
                    <a href="#" @click="logout()" class="article">{{ $t('buttons.logout') }}</a>
                </li>
            </ul>
        </nav>

        <!-- Page Content  -->
        <div id="content" >

            <nav class="navbar navbar-expand-lg navbar-light">
                <div class="container">
                  <div>

                    <button type="button" id="sidebarCollapse" @click="sidebarCollapse" class="btn btn-default btn-transparent">
                        <i class="fas fa-bars"></i>
                    </button>

                  </div>
                </div>
            </nav>
        </div>
    </div>

    <div class="overlay" @click="dismiss"></div>

    <modal :show.sync="modal.visible"
          body-classes="login-modal bg-white"
          modal-classes="modal-dialog-centered modal-sm">
      <card type="secondary" shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0 bg-white">

          <template v-if="modal.template == 1">
              <login
                :key="modal.visible"
                :errorMsg="errorMsg"
                :loading="loading"
                @login="login($event)"
                @forgotPassword="setTemplate(3)"
                @signUp="setTemplate(2)"
              >
              </login>
          </template>

          <template v-else-if="modal.template == 2">
              <sign-up
                :key="modal.visible"
                :errorMsg="errorMsg"
                :loading="loading"
                @register="register($event)"
                @close="setTemplate(1)"
              >
              </sign-up>

          </template>

          <template v-else-if="modal.template == 3">
              <forgot-password
                :key="modal.visible"
                :errorMsg="errorMsg"
                :loading="loading"
                @forgotPassword="forgotPassword($event)"
                @newPassword="setTemplate(4)"
                @close="setTemplate(1)"
              >
              </forgot-password>

          </template>

          <template v-else-if="modal.template == 4">
              <new-password
                :key="modal.visible"
                :errorMsg="errorMsg"
                :loading="loading"
                :showToken="$store.getters.isRequestingToken"
                @token="token = $event"
                @changePassword="changePassword($event)"
                @rollback="cancelToken()"
              >
              </new-password>

          </template>
      </card>
  </modal>
  </div>
</template>
<script>
import Modal from '../components/Modal'
import SignUp from './components/SignUp'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import NewPassword from './components/NewPassword'

import JQuery from 'jquery'
let $ = JQuery

export default {
  components: {
    Modal, SignUp, Login, ForgotPassword, NewPassword
  },
  data() {
    return {
      modal: {
        template: 1, // 1 = login, 2 = signup, 3 = forgot pass, 4 = new pass with token
        visible: false,
        login: true,
      },
      name: '',
      email: '',
      password: '',
      loading: false
    }
  },
  computed: {
    errorMsg: {
      get() {
        return this.$store.state.auth.error
      },
      set(value) {
        this.$store.state.auth.error = value
      }
    },
    isAuthenticated() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    setTemplate(template) {
      this.modal.template = template
      this.errorMsg = ''
      this.clearFields();
    },
    changeView() {
      this.modal.login = !this.modal.login
      this.errorMsg = ''
      this.clearFields();
    },
    logout() {
      this.$store.commit('logout');
      this.$store.commit('clearLists');
      this.modal.template = 1
      this.dismiss();
    },
    login({ email, password}) {
      this.errorMsg = ''
      this.$store.dispatch("login", {
        email, password
      });
      this.loading = true;
    },
    register({ name, email, password}) {
      this.errorMsg = ''
      this.$store.dispatch("register", {
        name,
        email,
        password
      });
      this.loading = true;
    },
    forgotPassword({ email }) {
      this.$store.dispatch("forgotPassword", { email });
      this.loading = true;
    },
    changePassword({ password, oldPassword, token }) {
      this.$store.dispatch("resetPassword", { password, oldPassword, token });
      this.loading = true;
    },
    cancelToken() {
      if (!this.$store.getters.isRequestingToken)
      {
        this.clearFields();
        this.modal.visible = false
      }
      else
      {
        this.$store.commit('cancelToken')
        this.modal.template = 1;
        this.errorMsg = '';
      }
    },
    changePasswordButton() {
      this.modal.template = 4
      this.modal.visible = true
    },
    clearFields() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.errorMsg = '';

    },
    sidebarCollapse() {
      $('#sidebar').addClass('active');
      $('.overlay').addClass('active');
      $('.collapse.in').toggleClass('in');
      $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    },
    dismiss() {
      $('#sidebar').removeClass('active');
      $('.overlay').removeClass('active');
      this.errorMsg = ''
    }
  },
  mounted() {
    this.errorMsg = ''
    this.$store.subscribe((mutation) => {
      if(mutation.type === 'login_success') {
        this.loading = false;

        this.modal.visible = false;
        this.clearFields();
        this.dismiss();
      }
      if(mutation.type === 'forgotpass_success') {

        this.loading = false;
        this.clearFields();
        this.dismiss();
      }

      if(mutation.type === 'changepass_success') {

        this.loading = false;
        this.clearFields();
        this.dismiss();
      }

      if (mutation.type === 'auth_error') {
        this.loading = false
      }
    })

    if (this.$store.getters.isRequestingToken)
      this.modal.template = 4
  },
}
</script>
<style lang="scss">
#content {
  /*position: absolute;*/
}
.text-muted small{
  color: #FFF !important;
}

</style>
