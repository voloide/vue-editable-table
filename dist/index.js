import { Loading as N, QSpinnerRings as ee, QCard as M, QCardSection as $, QBanner as W, QInput as X, QIcon as Y, QBtn as h, QTooltip as P, QTable as Z, QTd as O, Quasar as te, QToggle as ae, QSelect as ne } from "quasar";
import { ref as q, watch as Q, watchEffect as le, onBeforeUnmount as ie, computed as F, createBlock as v, openBlock as c, unref as t, withCtx as u, createVNode as p, createElementVNode as oe, toDisplayString as _, createCommentVNode as V, renderSlot as se, withKeys as re, createTextVNode as x, createSlots as de, createElementBlock as R, Fragment as H, renderList as J, normalizeStyle as ue, resolveDynamicComponent as ce, mergeProps as ge } from "vue";
function fe(i, f) {
  const a = q([...i.modelValue]);
  Q(() => i.modelValue, (e) => {
    a.value = [...e];
  });
  let b = !1;
  le(() => {
    i.loading ? b || (b = !0, setTimeout(() => {
      N.show({ spinner: ee });
    }, 0)) : b && (b = !1, N.hide());
  }), ie(() => N.hide());
  const r = q(/* @__PURE__ */ new Set()), k = (e) => r.value.has(e), A = F(() => r.value.size > 0), w = F(
    () => i.columns.filter((e) => e.name !== "actions")
  );
  return {
    rows: a,
    editingRows: r,
    isEditing: k,
    isEditingAnyRow: A,
    addRow: () => {
      var g;
      if (i.useExternalAdd) {
        f("add");
        return;
      }
      if (A.value) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de criar um novo registo.");
        return;
      }
      const e = {
        _isNew: !0,
        lifeCycleStatus: "ACTIVE"
      };
      w.value.forEach((y) => {
        const E = y.editValueField || y.field;
        e[E] = "";
      }), a.value.push(e), r.value.add(e), f("update:modelValue", [...a.value]);
    },
    editRow: (e) => {
      var g;
      if (i.useExternalEdit) {
        f("edit", e);
        return;
      }
      if (A.value) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de editar outro registo.");
        return;
      }
      e._backup = { ...e }, r.value.add(e);
    },
    cancelEdit: (e) => {
      e._isNew ? a.value = a.value.filter((g) => g !== e) : e._backup && (Object.assign(e, e._backup), delete e._backup), r.value.delete(e), f("update:modelValue", [...a.value]);
    },
    saveRow: async (e) => {
      var E;
      const y = w.value.filter((o) => o.editType !== "toggle").map((o) => o.editValueField || o.field).find((o) => {
        const m = e[o];
        return m == null || m === "";
      });
      if (y) {
        const o = i.columns.find((C) => (C.editValueField || C.field) === y), m = (o == null ? void 0 : o.label) || y;
        (E = i.confirmError) == null || E.call(i, `O campo "${m}" é obrigatório.`);
        return;
      }
      try {
        const o = await new Promise((m, C) => {
          f("save", e, { resolve: m, reject: C });
        });
        Object.assign(e, o), delete e._backup, delete e._isNew, r.value.delete(e), f("update:modelValue", [...a.value]);
      } catch (o) {
        console.error("Erro ao salvar a linha:", o);
      }
    },
    deleteRow: async (e) => {
      var g, y;
      if (r.value.size > 0 && !k(e)) {
        (g = i.confirmError) == null || g.call(i, "Termine a edição atual antes de apagar outro registo.");
        return;
      }
      try {
        if (!await ((y = i.confirmDelete) == null ? void 0 : y.call(
          i,
          "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
        ))) return;
        await new Promise((o, m) => {
          f("delete", e, { resolve: o, reject: m });
        }), a.value = a.value.filter((o) => o !== e), r.value.delete(e), f("update:modelValue", [...a.value]);
      } catch (E) {
        console.error("Erro ao apagar a linha:", E);
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
const me = { class: "text-subtitle2 text-primary" }, ye = { key: 0 }, pe = {
  key: 1,
  class: "q-gutter-sm"
}, be = {
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
    var m, C, K, L, G;
    const a = i, b = f, r = q(""), k = q({
      sortBy: ((m = a.pagination) == null ? void 0 : m.sortBy) ?? "id",
      descending: ((C = a.pagination) == null ? void 0 : C.descending) ?? !1,
      page: ((K = a.pagination) == null ? void 0 : K.page) ?? 1,
      rowsPerPage: ((L = a.pagination) == null ? void 0 : L.rowsPerPage) ?? 10,
      rowsNumber: ((G = a.pagination) == null ? void 0 : G.rowsNumber) ?? 0
    });
    Q(() => a.pagination, (n) => {
      k.value = {
        sortBy: (n == null ? void 0 : n.sortBy) ?? "id",
        descending: (n == null ? void 0 : n.descending) ?? !1,
        page: (n == null ? void 0 : n.page) ?? 1,
        rowsPerPage: (n == null ? void 0 : n.rowsPerPage) ?? 10,
        rowsNumber: (n == null ? void 0 : n.rowsNumber) ?? 0
      };
    }), Q(() => {
      var n;
      return (n = a.pagination) == null ? void 0 : n.rowsNumber;
    }, (n) => {
      k.value.rowsNumber = n ?? 0;
    });
    const {
      rows: A,
      isEditing: w,
      isEditingAnyRow: B,
      addRow: D,
      editRow: I,
      cancelEdit: U,
      saveRow: j,
      deleteRow: z,
      search: T,
      toggleStatus: e,
      visibleColumns: g
    } = fe(a, b), y = F(() => (n) => a.extraActions.filter((s) => typeof s.visible == "function" ? s.visible(n) : s.visible !== !1)), E = (n) => {
      k.value = {
        ...n.pagination,
        rowsNumber: k.value.rowsNumber
      }, b("request", n);
    }, o = (n) => {
      if (n.editType === "select") {
        const s = n.editOptionsKey;
        return {
          options: a[s] || [],
          optionValue: "value",
          optionLabel: "label",
          emitValue: !0,
          mapOptions: !0,
          dense: !0,
          outlined: !0,
          placeholder: n.placeholder || "Selecionar"
        };
      }
      return n.editType === "toggle" ? {
        dense: !0,
        keepColor: !0,
        color: "primary"
      } : {
        dense: !0,
        outlined: !0,
        placeholder: n.placeholder || n.label
      };
    };
    return (n, s) => (c(), v(t(M), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: u(() => [
        p(t($), { class: "text-h6 q-pa-none" }, {
          default: u(() => [
            p(t(W), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: u(() => [
                a.hideSearchInput ? V("", !0) : (c(), v(t(X), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: r.value,
                  "onUpdate:modelValue": s[1] || (s[1] = (l) => r.value = l),
                  onKeyup: s[2] || (s[2] = re((l) => t(T)(r.value), ["enter"])),
                  disable: t(B)
                }, {
                  append: u(() => [
                    r.value ? (c(), v(t(Y), {
                      key: 0,
                      name: "close",
                      onClick: s[0] || (s[0] = () => {
                        r.value = "", t(T)("");
                      }),
                      class: "cursor-pointer"
                    })) : V("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                a.hideSearchButton ? V("", !0) : (c(), v(t(h), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: s[3] || (s[3] = (l) => t(T)(r.value)),
                  disable: t(B),
                  class: "q-ml-sm"
                }, {
                  default: u(() => [
                    p(t(P), { class: "bg-primary" }, {
                      default: u(() => s[6] || (s[6] = [
                        x("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                a.hideAddButton ? V("", !0) : (c(), v(t(h), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: s[4] || (s[4] = (l) => a.useExternalAdd ? b("add") : t(D)()),
                  disable: t(B)
                }, {
                  default: u(() => [
                    p(t(P), { class: "bg-primary" }, {
                      default: u(() => [
                        x("Criar novos " + _(a.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                se(n.$slots, "action-buttons")
              ]),
              default: u(() => [
                oe("span", me, _(a.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        p(t($), { class: "q-pa-md" }, {
          default: u(() => [
            p(t(Z), {
              rows: t(A),
              columns: a.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: k.value,
              "onUpdate:pagination": s[5] || (s[5] = (l) => k.value = l),
              "rows-per-page-options": a.rowsPerPageOptions,
              "pagination-label": (l, d, S) => `${l}-${d} de ${S} registros`,
              onRequest: E
            }, de({
              "body-cell-actions": u(({ row: l }) => [
                p(t(O), { class: "text-center" }, {
                  default: u(() => [
                    t(w)(l) ? (c(), R("div", ye, [
                      p(t(h), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (d) => t(j)(l)
                      }, null, 8, ["onClick"]),
                      p(t(h), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (d) => t(U)(l)
                      }, null, 8, ["onClick"])
                    ])) : (c(), R("div", pe, [
                      a.hideToggleStatus ? V("", !0) : (c(), v(t(h), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: l.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: l.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (d) => t(e)(l),
                        disable: t(B)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      a.hideEdit ? V("", !0) : (c(), v(t(h), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (d) => a.useExternalEdit ? b("edit", l) : t(I)(l)
                      }, null, 8, ["onClick"])),
                      a.hideDelete ? V("", !0) : (c(), v(t(h), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (d) => t(z)(l)
                      }, null, 8, ["onClick"])),
                      (c(!0), R(H, null, J(y.value(l), (d, S) => (c(), v(t(h), {
                        key: S,
                        dense: "",
                        flat: "",
                        icon: d.icon,
                        color: d.color || "primary",
                        onClick: (ve) => b(d.emit || "extra-action", l)
                      }, {
                        default: u(() => [
                          p(t(P), { class: "bg-primary" }, {
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
              J(t(g), (l) => ({
                name: `body-cell-${l.name}`,
                fn: u(({ row: d }) => [
                  p(t(O), {
                    style: ue(l.style)
                  }, {
                    default: u(() => [
                      t(w)(d) ? (c(), v(ce(l.editType === "select" ? "q-select" : l.editType === "toggle" ? "q-toggle" : "q-input"), ge({
                        key: 0,
                        modelValue: d[l.editValueField || l.field],
                        "onUpdate:modelValue": (S) => d[l.editValueField || l.field] = S
                      }, o(l)), null, 16, ["modelValue", "onUpdate:modelValue"])) : (c(), R(H, { key: 1 }, [
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
}, he = {
  install(i) {
    i.use(te, {
      components: {
        QCard: M,
        QCardSection: $,
        QBanner: W,
        QInput: X,
        QIcon: Y,
        QBtn: h,
        QTable: Z,
        QTd: O,
        QSelect: ne,
        QToggle: ae,
        QTooltip: P
      }
    }), i.component("EditableTable", be);
  }
};
export {
  be as EditableTable,
  he as default
};
