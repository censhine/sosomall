declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue" {
  import { ComponentCustomProperties } from "vue";
  import { Store } from "vuex";
  import { State } from "@/types";

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

declare module "vuex" {
  export * from "vuex/types/index.d.ts";
  export * from "vuex/types/vue.d.ts";
  export * from "vuex/types/helpers.d.ts";
  export * from "vuex/types/logger.d.ts";
}
