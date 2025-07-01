import { Loading as q, QSpinnerRings as te, QCard as W, QCardSection as N, QBanner as X, QInput as Y, QIcon as Z, QBtn as h, QTooltip as P, QTable as ee, QTd as O, Quasar as ne, QToggle as ae, QSelect as le } from "quasar";
import { ref as $, watch as Q, watchEffect as ie, onBeforeUnmount as oe, computed as F, createBlock as v, openBlock as c, unref as n, withCtx as u, createVNode as p, createElementVNode as re, toDisplayString as _, createCommentVNode as V, renderSlot as se, withKeys as de, createTextVNode as x, createSlots as ue, createElementBlock as R, Fragment as J, renderList as M, normalizeStyle as ce, resolveDynamicComponent as ge, mergeProps as fe } from "vue";
function me(i, f) {
  const a = $([...i.modelValue]);
  Q(() => i.modelValue, (e) => {
    a.value = [...e];
  });
  let b = !1;
  ie(() => {
    i.loading ? b || (b = !0, setTimeout(() => {
      q.show({ spinner: te });
    }, 0)) : b && (b = !1, q.hide());
  }), oe(() => q.hide());
  const s = $(/* @__PURE__ */ new Set()), E = (e) => s.value.has(e), T = F(() => s.value.size > 0), w = F(
    () => i.columns.filter((e) => e.name !== "actions")
  );
  return {
    rows: a,
    editingRows: s,
    isEditing: E,
    isEditingAnyRow: T,
    addRow: () => {
      var g;
      if (i.useExternalAdd) {
        f("add");
        return;
      }
      if (T.value) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de criar um novo registo.");
        return;
      }
      const e = {
        _isNew: !0,
        lifeCycleStatus: "ACTIVE"
      };
      w.value.forEach((m) => {
        const k = m.editValueField || m.field;
        e[k] = "";
      }), a.value.push(e), s.value.add(e), f("update:modelValue", [...a.value]);
    },
    editRow: (e) => {
      var g;
      if (i.useExternalEdit) {
        f("edit", e);
        return;
      }
      if (T.value) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de editar outro registo.");
        return;
      }
      e._backup = { ...e }, s.value.add(e);
    },
    cancelEdit: (e) => {
      e._isNew ? a.value = a.value.filter((g) => g !== e) : e._backup && (Object.assign(e, e._backup), delete e._backup), s.value.delete(e), f("update:modelValue", [...a.value]);
    },
    saveRow: async (e) => {
      var k;
      const m = w.value.filter((r) => r.editType !== "toggle").map((r) => r.editValueField || r.field).find((r) => {
        const y = e[r];
        return y == null || y === "";
      });
      if (m) {
        const r = i.columns.find((C) => (C.editValueField || C.field) === m), y = (r == null ? void 0 : r.label) || m;
        (k = i.confirmError) == null || k.call(i, `O campo "${y}" é obrigatório.`);
        return;
      }
      try {
        const r = await new Promise((y, C) => {
          f("save", e, { resolve: y, reject: C });
        });
        Object.assign(e, r), delete e._backup, delete e._isNew, s.value.delete(e), f("update:modelValue", [...a.value]);
      } catch (r) {
        console.error("Erro ao salvar a linha:", r);
      }
    },
    deleteRow: async (e) => {
      var g, m;
      if (s.value.size > 0 && !E(e)) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de apagar outro registo.");
        return;
      }
      try {
        if (!await ((m = i.confirmDelete) == null ? void 0 : m.call(
          i,
          "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
        ))) return;
        await new Promise((r, y) => {
          f("delete", e, { resolve: r, reject: y });
        }), a.value = a.value.filter((r) => r !== e), s.value.delete(e), f("update:modelValue", [...a.value]);
      } catch (k) {
        console.error("Erro ao apagar a linha:", k);
      }
    },
    search: (e) => {
      f("search", e.trim());
    },
    toggleStatus: (e) => {
      f("toggle-status", e);
    },
    visibleColumns: w
  };
}
const ye = { class: "text-subtitle2 text-primary" }, pe = { key: 0 }, be = {
  key: 1,
  class: "q-gutter-sm"
}, ve = {
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
  setup(i, { emit: f }) {
    var C, K, L, G, H;
    const a = i, b = f, s = $(""), E = $({
      sortBy: ((C = a.pagination) == null ? void 0 : C.sortBy) ?? "id",
      descending: ((K = a.pagination) == null ? void 0 : K.descending) ?? !1,
      page: ((L = a.pagination) == null ? void 0 : L.page) ?? 1,
      rowsPerPage: ((G = a.pagination) == null ? void 0 : G.rowsPerPage) ?? 10,
      rowsNumber: ((H = a.pagination) == null ? void 0 : H.rowsNumber) ?? 0
    });
    Q(() => a.pagination, (t) => {
      E.value = {
        sortBy: (t == null ? void 0 : t.sortBy) ?? "id",
        descending: (t == null ? void 0 : t.descending) ?? !1,
        page: (t == null ? void 0 : t.page) ?? 1,
        rowsPerPage: (t == null ? void 0 : t.rowsPerPage) ?? 10,
        rowsNumber: (t == null ? void 0 : t.rowsNumber) ?? 0
      };
    }), Q(() => {
      var t;
      return (t = a.pagination) == null ? void 0 : t.rowsNumber;
    }, (t) => {
      E.value.rowsNumber = t ?? 0;
    });
    const {
      rows: T,
      isEditing: w,
      isEditingAnyRow: A,
      addRow: D,
      editRow: I,
      cancelEdit: U,
      saveRow: j,
      deleteRow: z,
      search: S,
      toggleStatus: e,
      visibleColumns: g
    } = me(a, b), m = F(() => (t) => a.extraActions.filter((o) => typeof o.visible == "function" ? o.visible(t) : o.visible !== !1)), k = (t) => {
      const o = t.editType === "select" ? "q-select" : t.editType === "toggle" ? "q-toggle" : "q-input";
      return console.log(`editType for column "${t.name}" is "${t.editType}", rendering component: ${o}`), o;
    }, r = (t) => {
      E.value = {
        ...t.pagination,
        rowsNumber: E.value.rowsNumber
      }, b("request", t);
    }, y = (t) => {
      if (t.editType === "select") {
        const o = t.editOptionsKey;
        return {
          options: a[o] || [],
          optionValue: "value",
          optionLabel: "label",
          emitValue: !0,
          mapOptions: !0,
          dense: !0,
          outlined: !0,
          placeholder: t.placeholder || "Selecionar"
        };
      }
      return t.editType === "toggle" ? {
        dense: !0,
        keepColor: !0,
        color: "primary"
      } : {
        dense: !0,
        outlined: !0,
        placeholder: t.placeholder || t.label
      };
    };
    return (t, o) => (c(), v(n(W), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: u(() => [
        p(n(N), { class: "text-h6 q-pa-none" }, {
          default: u(() => [
            p(n(X), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: u(() => [
                a.hideSearchInput ? V("", !0) : (c(), v(n(Y), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: s.value,
                  "onUpdate:modelValue": o[1] || (o[1] = (l) => s.value = l),
                  onKeyup: o[2] || (o[2] = de((l) => n(S)(s.value), ["enter"])),
                  disable: n(A)
                }, {
                  append: u(() => [
                    s.value ? (c(), v(n(Z), {
                      key: 0,
                      name: "close",
                      onClick: o[0] || (o[0] = () => {
                        s.value = "", n(S)("");
                      }),
                      class: "cursor-pointer"
                    })) : V("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                a.hideSearchButton ? V("", !0) : (c(), v(n(h), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: o[3] || (o[3] = (l) => n(S)(s.value)),
                  disable: n(A),
                  class: "q-ml-sm"
                }, {
                  default: u(() => [
                    p(n(P), { class: "bg-primary" }, {
                      default: u(() => o[6] || (o[6] = [
                        x("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                a.hideAddButton ? V("", !0) : (c(), v(n(h), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: o[4] || (o[4] = (l) => a.useExternalAdd ? b("add") : n(D)()),
                  disable: n(A)
                }, {
                  default: u(() => [
                    p(n(P), { class: "bg-primary" }, {
                      default: u(() => [
                        x("Criar novos " + _(a.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                se(t.$slots, "action-buttons")
              ]),
              default: u(() => [
                re("span", ye, _(a.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        p(n(N), { class: "q-pa-md" }, {
          default: u(() => [
            p(n(ee), {
              rows: n(T),
              columns: a.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: E.value,
              "onUpdate:pagination": o[5] || (o[5] = (l) => E.value = l),
              "rows-per-page-options": a.rowsPerPageOptions,
              "pagination-label": (l, d, B) => `${l}-${d} de ${B} registros`,
              onRequest: r
            }, ue({
              "body-cell-actions": u(({ row: l }) => [
                p(n(O), { class: "text-center" }, {
                  default: u(() => [
                    n(w)(l) ? (c(), R("div", pe, [
                      p(n(h), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (d) => n(j)(l)
                      }, null, 8, ["onClick"]),
                      p(n(h), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (d) => n(U)(l)
                      }, null, 8, ["onClick"])
                    ])) : (c(), R("div", be, [
                      a.hideToggleStatus ? V("", !0) : (c(), v(n(h), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: l.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: l.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (d) => n(e)(l),
                        disable: n(A)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      a.hideEdit ? V("", !0) : (c(), v(n(h), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (d) => a.useExternalEdit ? b("edit", l) : n(I)(l)
                      }, null, 8, ["onClick"])),
                      a.hideDelete ? V("", !0) : (c(), v(n(h), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (d) => n(z)(l)
                      }, null, 8, ["onClick"])),
                      (c(!0), R(J, null, M(m.value(l), (d, B) => (c(), v(n(h), {
                        key: B,
                        dense: "",
                        flat: "",
                        icon: d.icon,
                        color: d.color || "primary",
                        onClick: (Ee) => b(d.emit || "extra-action", l)
                      }, {
                        default: u(() => [
                          p(n(P), { class: "bg-primary" }, {
                            default: u(() => [
                              x(_(d.tooltip), 1)
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
              M(n(g), (l) => ({
                name: `body-cell-${l.name}`,
                fn: u(({ row: d }) => [
                  p(n(O), {
                    style: ce(l.style)
                  }, {
                    default: u(() => [
                      n(w)(d) ? (c(), v(ge(k(l)), fe({
                        key: 0,
                        modelValue: d[l.editValueField || l.field],
                        "onUpdate:modelValue": (B) => d[l.editValueField || l.field] = B
                      }, y(l)), null, 16, ["modelValue", "onUpdate:modelValue"])) : (c(), R(J, { key: 1 }, [
                        x(_(d[l.field] || "—"), 1)
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
}, Ce = {
  install(i) {
    i.use(ne, {
      components: {
        QCard: W,
        QCardSection: N,
        QBanner: X,
        QInput: Y,
        QIcon: Z,
        QBtn: h,
        QTable: ee,
        QTd: O,
        QSelect: le,
        QToggle: ae,
        QTooltip: P
      }
    }), i.component("EditableTable", ve);
  }
};
export {
  ve as EditableTable,
  Ce as default
};
