import Vuex from "vuex";
import { mount, createLocalVue } from "@vue/test-utils";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import TreeItem from "@/components/substance/TreeItem.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(IconsPlugin);

const treeData = {
  name: "2020-04-20",
  children: [
    {
      name: "karyn",
      children: [
        {
          id: 1,
          name: "DTXSID502000000",
          children: []
        }
      ]
    }
  ]
};

describe("TreeItem", () => {
  test("tree recurses items", async () => {
    const wrapper = mount(TreeItem, {
      propsData: {
        item: treeData
      },
      localVue
    });
    const items = wrapper.findAll(TreeItem);
    expect(wrapper.find("div").text()).toContain("2020-04-20");
    // user and substance nested
    expect(items).toHaveLength(3);
    expect(
      items
        .at(1)
        .find("div")
        .text()
    ).toContain("karyn");
    // substance nested
    expect(items.at(1).findAll(TreeItem)).toHaveLength(2);
    expect(
      items
        .at(2)
        .find("div")
        .text()
    ).toContain("DTXSID502000000");
    // only itself
    expect(items.at(2).findAll(TreeItem)).toHaveLength(1);
  });
  test("tree item opens on click event", async () => {
    const wrapper = mount(TreeItem, {
      propsData: {
        item: treeData
      },
      localVue
    });
    expect(wrapper.find("span").text()).toContain("[+]");
    expect(wrapper.vm.isOpen).toBe(false);
    await wrapper.find("div").trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.find("span").text()).toContain("[-]");
    await wrapper.find("div").trigger("click");
    expect(wrapper.vm.isOpen).toBe(false);
    expect(wrapper.find("span").text()).toContain("[+]");
  });
});
