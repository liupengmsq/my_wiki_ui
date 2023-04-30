<template>
  <div class="dropdown">
    <button @click="showDropdown" class="dropbtn">
      <span class="icon" :class="{'icon-svg-dyn-os-default':defaultThemeClass,'icon-svg-dyn-light': lightThemeClass,'icon-svg-dyn-dark': darkThemeClass}">
    </span>Theme</button>
    <div v-if="showMenu" class="dropdown-content">
      <a @click="switchToOSDefaultTheme" href="#"><div class="dropdown-item" :class="{'dropdown-item--selected':defaultThemeDropdownItemSelected}"><span class="icon-os-default"></span>OS Default</div></a>
      <a @click="switchToLightTheme" href="#"><div class="dropdown-item" :class="{'dropdown-item--selected':lightThemeDropdownItemSelected}"><span class="icon-light"></span>Light</div></a>
      <a @click="switchToDarkTheme" href="#"><div class="dropdown-item" :class="{'dropdown-item--selected':darkThemeDropdownItemSelected}"><span class="icon-dark"></span>Dark</div></a>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import themeOSDefault from '../../assets/icon/theme-os-default.svg';
import light from 'highlight.js/styles/github.css?url'
import dark from 'highlight.js/styles/dark.css?url'

export default {
  name: 'ThemeSwitcher',
  setup() {
    onMounted(() => {
      console.log(themeOSDefault);
    });

    // 点击Theme按钮显示和隐藏下拉框
    const showMenu = ref(false);
    const showDropdown = () => {
      showMenu.value = !showMenu.value;
    }

    const defaultThemeClass = ref(true);
    const lightThemeClass = ref(false);
    const darkThemeClass = ref(false);
    const defaultThemeDropdownItemSelected = ref(true);
    const lightThemeDropdownItemSelected = ref(false);
    const darkThemeDropdownItemSelected = ref(false);

    // 切换为OS默认主题
    const switchToOSDefaultTheme = () => {
      // 更改下拉菜单的图标与选中状态
      defaultThemeClass.value = true;
      defaultThemeDropdownItemSelected.value = true;
      lightThemeClass.value = false;
      lightThemeDropdownItemSelected.value = false;
      darkThemeClass.value = false;
      darkThemeDropdownItemSelected.value = false;

      var theme = document.getElementById('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        if (document.documentElement.classList.contains("light")) {
          document.documentElement.classList.remove("light")
          document.documentElement.classList.add("dark")
          theme.setAttribute('href', dark);
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark")
          document.documentElement.classList.add("light")
          theme.setAttribute('href', light);
        }
      }

      localStorage.theme = 'os-default';
      console.log('theme', theme);

      // 关闭下拉菜单
      showMenu.value = false;
    }

    // 切换为Light主题
    const switchToLightTheme = () => {
      // 更改下拉菜单的图标与选中状态
      defaultThemeClass.value = false;
      defaultThemeDropdownItemSelected.value = false;
      lightThemeClass.value = true;
      lightThemeDropdownItemSelected.value = true;
      darkThemeClass.value = false;
      darkThemeDropdownItemSelected.value = false;

      var theme = document.getElementById('theme');
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
        theme.setAttribute('href', light);
      }

      localStorage.theme = 'light';
      // 关闭下拉菜单
      showMenu.value = false;
    }

    // 切换为Dark主题
    const switchToDarkTheme = () => {
      // 更改下拉菜单的图标与选中状态
      defaultThemeClass.value = false;
      defaultThemeDropdownItemSelected.value = false;
      lightThemeClass.value = false;
      lightThemeDropdownItemSelected.value = false;
      darkThemeClass.value = true;
      darkThemeDropdownItemSelected.value = true;

      var theme = document.getElementById('theme');
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")
        theme.setAttribute('href', dark);
      }

      localStorage.theme = 'dark';

      // 关闭下拉菜单
      showMenu.value = false;
    }

    return {
      showMenu,
      showDropdown,
      defaultThemeClass,
      lightThemeClass,
      darkThemeClass,
      switchToOSDefaultTheme,
      switchToLightTheme,
      switchToDarkTheme,
      defaultThemeDropdownItemSelected,
      lightThemeDropdownItemSelected,
      darkThemeDropdownItemSelected
    }
  }
}
</script>

<style scoped>
/* Dropdown Button */
.dropbtn {
  background-color: var(--body-background-color);
  color: var(--button-color);
  padding: .05rem;
  font-size: .15rem;
  font-weight: 500;
  border: none;
  border-radius: 0.05rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.icon-svg-dyn-os-default {
  mask-image: url('../../assets/icon/theme-os-default.svg');
  -webkit-mask-image: url('../../assets/icon/theme-os-default.svg');
}
.icon-svg-dyn-light {
  mask-image: url('../../assets/icon/theme-light.svg');
  -webkit-mask-image: url('../../assets/icon/theme-light.svg');
}
.icon-svg-dyn-dark {
  mask-image: url('../../assets/icon/theme-dark.svg');
  -webkit-mask-image: url('../../assets/icon/theme-dark.svg');
}

.icon {
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  background-color: var(--theme-icon-background-color);

  display: inline-block;
  width: .20rem;
  height: .20rem;
  margin-right:.04rem;
}

.icon-os-default {
  mask-image: url('../../assets/icon/theme-os-default.svg');
  -webkit-mask-image: url('../../assets/icon/theme-os-default.svg');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  background-color: var(--theme-icon-background-color);

  display: inline-block;
  width: .20rem;
  height: .20rem;
  margin-right:.04rem;
}

.icon-light {
  mask-image: url('../../assets/icon/theme-light.svg');
  -webkit-mask-image: url('../../assets/icon/theme-light.svg');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  background-color: var(--theme-icon-background-color);

  display: inline-block;
  width: .20rem;
  height: .20rem;
  margin-right:.04rem;
}

.icon-dark {
  mask-image: url('../../assets/icon/theme-dark.svg');
  -webkit-mask-image: url('../../assets/icon/theme-dark.svg');
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  background-color: var(--theme-icon-background-color);

  display: inline-block;
  width: .20rem;
  height: .20rem;
  margin-right:.04rem;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: block;
  position: absolute;
  background-color: var(--theme-dropdown-content-background-color);

  min-width: 1.3rem;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 0.05rem;
  padding: .08rem;
}

/* Links inside the dropdown */
.dropdown-content a {
  font-weight: 500;
  color: var(--button-color);
  padding: .05rem;
  font-size: .14rem;
  text-decoration: none;
  display: block;
  text-align: left;
}

a:hover {
  background: rgba(0, 0, 0, 0);
}

.dropdown-item {
  display: flex;
  padding: .05rem .1rem;
  border-radius: 0.05rem;
  align-items: center;
  justify-content: flex-start;
}
.dropdown-item--selected {
  background-color: var(--theme-dropdown-item-selected-background-color);
  border: .01rem solid #696969;
}
.dropdown-item:hover {
  background-color: var(--theme-dropdown-hover-background-color); 
}

.dropdown:hover .dropbtn {
  background-color: var(--theme-dropdown-hover-background-color); 
}

</style>
