import { Loading as q, QSpinnerRings as ne, QCard as Y, QCardSection as Q, QBanner as Z, QInput as w, QIcon as ee, QBtn as E, QTooltip as P, QTable as te, QTd as U, QSelect as ae, QToggle as le, Quasar as ie } from "quasar";
import { ref as O, watch as N, watchEffect as de, onBeforeUnmount as oe, computed as I, createBlock as b, openBlock as u, unref as l, withCtx as g, createVNode as k, createElementVNode as se, toDisplayString as R, createCommentVNode as A, renderSlot as re, withKeys as ue, createTextVNode as F, createSlots as ce, createElementBlock as S, Fragment as J, renderList as X, normalizeStyle as fe, mergeProps as $ } from "vue";
function ge(i, h) {
  const n = O([...i.modelValue]), c = /* @__PURE__ */ new Map();
  N(() => i.modelValue, (e) => {
    n.value = [...e];
  });
  let V = !1;
  de(() => {
    i.loading ? V || (V = !0, setTimeout(() => {
      q.show({ spinner: ne });
    }, 0)) : V && (V = !1, q.hide());
  }), oe(() => q.hide());
  const f = O(/* @__PURE__ */ new Set()), T = (e) => f.value.has(e), B = I(() => f.value.size > 0), C = I(
    () => i.columns.filter((e) => e.name !== "actions")
  );
  return {
    rows: n,
    editingRows: f,
    isEditing: T,
    isEditingAnyRow: B,
    addRow: () => {
      var y;
      if (i.useExternalAdd) {
        h("add");
        return;
      }
      if (B.value) {
        (y = i.confirmError) == null || y.call(i, "Termine a edição atual antes de criar um novo registo.");
        return;
      }
      const e = {
        _isNew: !0,
        lifeCycleStatus: "ACTIVE"
      };
      C.value.forEach((m) => {
        const r = m.editValueField || m.field;
        e[r] = "";
      }), n.value.unshift(e), f.value.add(e);
    },
    editRow: (e) => {
      var m;
      if (i.useExternalEdit) {
        h("edit", e);
        return;
      }
      if (B.value) {
        (m = i.confirmError) == null || m.call(i, "Termine a edição atual antes de editar outro registo.");
        return;
      }
      e._backup = { ...e }, f.value.add(e);
      const y = N(
        () => i.columns.map((r) => e[r.dependsOn]),
        () => {
          i.columns.forEach((r) => {
            r.dependsOn && r.matchField && (e[r.editValueField || r.field] = null);
          });
        },
        { deep: !1 }
      );
      c.set(e, y);
    },
    cancelEdit: (e) => {
      e._isNew ? n.value = n.value.filter((y) => y !== e) : e._backup && (Object.assign(e, e._backup), delete e._backup), c.has(e) && (c.get(e)(), c.delete(e)), f.value.delete(e), h("update:modelValue", [...n.value]);
    },
    saveRow: async (e) => {
      var r;
      const m = C.value.filter((o) => o.editType !== "toggle").map((o) => o.editValueField || o.field).find((o) => {
        const p = e[o];
        return p == null || p === "";
      });
      if (m) {
        const o = i.columns.find((_) => (_.editValueField || _.field) === m), p = (o == null ? void 0 : o.label) || m;
        (r = i.confirmError) == null || r.call(i, `O campo "${p}" é obrigatório.`);
        return;
      }
      try {
        const o = await new Promise((p, _) => {
          h("save", e, { resolve: p, reject: _ });
        });
        Object.assign(e, o), delete e._backup, delete e._isNew, c.has(e) && (c.get(e)(), c.delete(e)), f.value.delete(e), h("update:modelValue", [...n.value]);
      } catch (o) {
        console.error("Erro ao salvar a linha:", o);
      }
    },
    deleteRow: async (e) => {
      var y, m;
      if (f.value.size > 0 && !T(e)) {
        (y = i.confirmError) == null || y.call(i, "Termine a edição atual antes de apagar outro registo.");
        return;
      }
      try {
        if (!await ((m = i.confirmDelete) == null ? void 0 : m.call(
          i,
          "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
        ))) return;
        await new Promise((o, p) => {
          h("delete", e, { resolve: o, reject: p });
        }), console.log("deleteGroupHandler", e), c.has(e) && (c.get(e)(), c.delete(e)), n.value = n.value.filter((o) => o !== e), f.value.delete(e), h("update:modelValue", [...n.value]);
      } catch (r) {
        console.error("Erro ao apagar a linha:", r);
      }
    },
    search: (e) => {
      h("search", e.trim());
    },
    toggleStatus: (e) => {
      h("toggle-status", e);
    },
    visibleColumns: C
  };
}
const me = { class: "text-subtitle2 text-primary" }, ye = {
  key: 0,
  style: { width: "100%" }
}, pe = { key: 0 }, be = {
  key: 1,
  class: "q-gutter-sm"
}, he = {
  __name: "EditableTable",
  props: {
    title: String,
    modelValue: Array,
    columns: Array,
    programOptions: Array,
    serviceOptions: Array,
    programActivityOptions: Array,
    provinceOptions: Array,
    districtOptions: Array,
    loading: Boolean,
    pagination: Object,
    rowsPerPageOptions: Array,
    confirmError: Function,
    confirmDelete: Function,
    useExternalAdd: Boolean,
    useExternalEdit: Boolean,
    hideDelete: { type: Boolean, default: !1 },
    hideEdit: { type: Boolean, default: !1 },
    hideToggleStatus: { type: Boolean, default: !1 },
    hideSearchInput: { type: Boolean, default: !1 },
    hideSearchButton: { type: Boolean, default: !1 },
    hideAddButton: { type: Boolean, default: !1 },
    extraActions: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:modelValue",
    "save",
    "delete",
    "search",
    "toggle-status",
    "request",
    "add",
    "edit",
    "extra-action",
    "custom-action"
  ],
  setup(i, { emit: h }) {
    var o, p, _, H, M;
    const n = i, c = h, V = O(""), f = O({
      sortBy: ((o = n.pagination) == null ? void 0 : o.sortBy) ?? "id",
      descending: ((p = n.pagination) == null ? void 0 : p.descending) ?? !1,
      page: ((_ = n.pagination) == null ? void 0 : _.page) ?? 1,
      rowsPerPage: ((H = n.pagination) == null ? void 0 : H.rowsPerPage) ?? 10,
      rowsNumber: ((M = n.pagination) == null ? void 0 : M.rowsNumber) ?? 0
    });
    N(() => n.pagination, (a) => {
      f.value = {
        sortBy: (a == null ? void 0 : a.sortBy) ?? "id",
        descending: (a == null ? void 0 : a.descending) ?? !1,
        page: (a == null ? void 0 : a.page) ?? 1,
        rowsPerPage: (a == null ? void 0 : a.rowsPerPage) ?? 10,
        rowsNumber: (a == null ? void 0 : a.rowsNumber) ?? 0
      };
    }), N(() => {
      var a;
      return (a = n.pagination) == null ? void 0 : a.rowsNumber;
    }, (a) => {
      f.value.rowsNumber = a ?? 0;
    });
    const {
      rows: T,
      isEditing: B,
      isEditingAnyRow: C,
      addRow: D,
      editRow: K,
      cancelEdit: L,
      saveRow: j,
      deleteRow: z,
      search: x,
      toggleStatus: G,
      visibleColumns: e
    } = ge(n, c), y = I(() => (a) => n.extraActions.filter((s) => typeof s.visible == "function" ? s.visible(a) : s.visible !== !1)), m = (a) => {
      f.value = {
        ...a.pagination,
        rowsNumber: f.value.rowsNumber
      }, c("request", a);
    }, r = (a, s) => {
      if (a.editType === "select") {
        const t = a.editOptionsKey;
        let d = n[t] || [];
        if (a.dependsOn && a.matchField) {
          const v = s[a.dependsOn];
          d = d.filter((W) => W[a.matchField] === v);
        }
        return {
          options: d,
          optionValue: a.optionValueKey || "value",
          optionLabel: a.optionLabelKey || "label",
          emitValue: !0,
          mapOptions: !0,
          dense: !0,
          outlined: !0,
          placeholder: a.placeholder || "Selecionar"
        };
      }
      return a.editType === "toggle" ? {
        dense: !0,
        keepColor: !0,
        color: "primary"
      } : {
        dense: !0,
        outlined: !0,
        placeholder: a.placeholder || a.label
      };
    };
    return (a, s) => (u(), b(l(Y), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: g(() => [
        k(l(Q), { class: "text-h6 q-pa-none" }, {
          default: g(() => [
            k(l(Z), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: g(() => [
                n.hideSearchInput ? A("", !0) : (u(), b(l(w), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição, Código",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: V.value,
                  "onUpdate:modelValue": s[1] || (s[1] = (t) => V.value = t),
                  onKeyup: s[2] || (s[2] = ue((t) => l(x)(V.value), ["enter"])),
                  disable: l(C)
                }, {
                  append: g(() => [
                    V.value ? (u(), b(l(ee), {
                      key: 0,
                      name: "close",
                      onClick: s[0] || (s[0] = () => {
                        V.value = "", l(x)("");
                      }),
                      class: "cursor-pointer"
                    })) : A("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                n.hideSearchButton ? A("", !0) : (u(), b(l(E), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: s[3] || (s[3] = (t) => l(x)(V.value)),
                  disable: l(C),
                  class: "q-ml-sm"
                }, {
                  default: g(() => [
                    k(l(P), { class: "bg-primary" }, {
                      default: g(() => s[6] || (s[6] = [
                        F("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                n.hideAddButton ? A("", !0) : (u(), b(l(E), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: s[4] || (s[4] = (t) => n.useExternalAdd ? c("add") : l(D)()),
                  disable: l(C)
                }, {
                  default: g(() => [
                    k(l(P), { class: "bg-primary" }, {
                      default: g(() => [
                        F("Criar novos " + R(n.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                re(a.$slots, "action-buttons")
              ]),
              default: g(() => [
                se("span", me, R(n.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        k(l(Q), { class: "q-pa-md" }, {
          default: g(() => [
            k(l(te), {
              rows: l(T),
              columns: n.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: f.value,
              "onUpdate:pagination": s[5] || (s[5] = (t) => f.value = t),
              "rows-per-page-options": n.rowsPerPageOptions,
              "pagination-label": (t, d, v) => `${t}-${d} de ${v} registros`,
              onRequest: m
            }, ce({
              "body-cell-actions": g(({ row: t }) => [
                k(l(U), { class: "text-center" }, {
                  default: g(() => [
                    l(B)(t) ? (u(), S("div", pe, [
                      k(l(E), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (d) => l(j)(t)
                      }, null, 8, ["onClick"]),
                      k(l(E), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (d) => l(L)(t)
                      }, null, 8, ["onClick"])
                    ])) : (u(), S("div", be, [
                      n.hideToggleStatus ? A("", !0) : (u(), b(l(E), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: t.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: t.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (d) => l(G)(t),
                        disable: l(C)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      n.hideEdit ? A("", !0) : (u(), b(l(E), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (d) => n.useExternalEdit ? c("edit", t) : l(K)(t)
                      }, null, 8, ["onClick"])),
                      n.hideDelete ? A("", !0) : (u(), b(l(E), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (d) => l(z)(t)
                      }, null, 8, ["onClick"])),
                      (u(!0), S(J, null, X(y.value(t), (d, v) => (u(), b(l(E), {
                        key: v,
                        dense: "",
                        flat: "",
                        icon: d.icon,
                        color: d.color || "primary",
                        onClick: (W) => c(d.emit || "extra-action", t)
                      }, {
                        default: g(() => [
                          k(l(P), { class: "bg-primary" }, {
                            default: g(() => [
                              F(R(d.tooltip), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["icon", "color", "onClick"]))), 128))
                    ]))
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, [
              X(l(e), (t) => ({
                name: `body-cell-${t.name}`,
                fn: g(({ row: d }) => [
                  k(l(U), {
                    style: fe(t.style),
                    class: "q-pa-xs"
                  }, {
                    default: g(() => [
                      l(B)(d) ? (u(), S("div", ye, [
                        t.editType === "select" ? (u(), b(l(ae), $({
                          key: 0,
                          modelValue: d[t.editValueField || t.field],
                          "onUpdate:modelValue": (v) => d[t.editValueField || t.field] = v
                        }, r(t, d), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"])) : t.editType === "toggle" ? (u(), b(l(le), $({
                          key: 1,
                          modelValue: d[t.editValueField || t.field],
                          "onUpdate:modelValue": (v) => d[t.editValueField || t.field] = v
                        }, r(t, d)), null, 16, ["modelValue", "onUpdate:modelValue"])) : (u(), b(l(w), $({
                          key: 2,
                          modelValue: d[t.editValueField || t.field],
                          "onUpdate:modelValue": (v) => d[t.editValueField || t.field] = v
                        }, r(t, d), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"]))
                      ])) : (u(), S(J, { key: 1 }, [
                        F(R(d[t.field] || "—"), 1)
                      ], 64))
                    ]),
                    _: 2
                  }, 1032, ["style"])
                ])
              }))
            ]), 1032, ["rows", "columns", "pagination", "rows-per-page-options", "pagination-label"])
          ]),
          _: 1
        })
      ]),
      _: 3
    }));
  }
}, ke = {
  install(i) {
    i.use(ie, {
      components: {
        QCard: Y,
        QCardSection: Q,
        QBanner: Z,
        QInput: w,
        QIcon: ee,
        QBtn: E,
        QTable: te,
        QTd: U,
        QSelect: ae,
        QToggle: le,
        QTooltip: P
      }
    }), i.component("EditableTable", he);
  }
};
export {
  he as EditableTable,
  ke as default
};
