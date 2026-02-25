import { Loading as M, QSpinnerRings as ue, QCard as ne, QCardSection as H, QBanner as ae, QInput as J, QIcon as ie, QBtn as V, QTooltip as I, QTable as se, QTd as X, QSelect as le, QToggle as de, Quasar as oe } from "quasar";
import { ref as K, watch as P, watchEffect as re, onBeforeUnmount as fe, computed as Y, createBlock as k, openBlock as g, unref as s, withCtx as p, createVNode as O, createElementVNode as ce, toDisplayString as $, createCommentVNode as _, renderSlot as ge, withKeys as me, createTextVNode as Q, createSlots as ye, createElementBlock as R, Fragment as ee, renderList as te, normalizeStyle as pe, mergeProps as G } from "vue";
function he(d, b) {
  const l = K([...d.modelValue ?? []]), C = /* @__PURE__ */ new Map();
  P(() => d.modelValue, (t) => {
    l.value = [...t ?? []];
  });
  let E = !1;
  re(() => {
    d.loading ? E || (E = !0, setTimeout(() => {
      M.show({ spinner: ue });
    }, 0)) : E && (E = !1, M.hide());
  }), fe(() => M.hide());
  const m = K(/* @__PURE__ */ new Set()), q = (t) => m.value.has(t), A = Y(() => m.value.size > 0), S = Y(
    () => (d.columns ?? []).filter((t) => t && t.name !== "actions")
  ), T = (t, u) => typeof t == "function" ? !!t({ row: u, props: d }) : !!t, F = (t, u) => !!(t != null && t.editType) && (t.editable === void 0 ? !0 : T(t.editable, u)) && !T(t.hideInEdit, u), U = (t, u) => T(t == null ? void 0 : t.disabled, u), D = (t, u) => T(t == null ? void 0 : t.readonly, u), j = (t, u) => T(t == null ? void 0 : t.required, u), v = (t) => t.editValueField || (typeof t.field == "string" ? t.field : t.name), L = () => {
    var u;
    if (d.useExternalAdd) {
      b("add");
      return;
    }
    if (A.value) {
      (u = d.confirmError) == null || u.call(d, "Termine a edição atual antes de criar um novo registo.");
      return;
    }
    const t = { _isNew: !0, lifeCycleStatus: "ACTIVE" };
    for (const f of S.value) {
      if (!F(f, t)) continue;
      const h = v(f);
      h && (t[h] = f.editType === "toggle" ? !1 : null);
    }
    l.value.unshift(t), m.value.add(t);
  }, z = (t) => {
    var h;
    if (d.useExternalEdit) {
      b("edit", t);
      return;
    }
    if (A.value) {
      (h = d.confirmError) == null || h.call(d, "Termine a edição atual antes de editar outro registo.");
      return;
    }
    t._backup = { ...t }, m.value.add(t);
    const u = Array.from(new Set(
      (d.columns || []).flatMap((r) => {
        const c = [];
        return r.dependsOn && c.push(r.dependsOn), Array.isArray(r.resetOnChangeOf) ? c.push(...r.resetOnChangeOf) : r.resetOnChangeOf && c.push(r.resetOnChangeOf), c;
      }).filter(Boolean)
    )), f = P(
      () => u.map((r) => t[r]),
      (r, c) => {
        const o = new Set(
          u.filter((e, a) => (r == null ? void 0 : r[a]) !== (c == null ? void 0 : c[a]))
        );
        (d.columns || []).forEach((e) => {
          if (e.dependsOn && e.matchField && o.has(e.dependsOn)) {
            const a = v(e);
            a && (t[a] = null);
          }
        }), (d.columns || []).forEach((e) => {
          if ((Array.isArray(e.resetOnChangeOf) ? e.resetOnChangeOf : e.resetOnChangeOf ? [e.resetOnChangeOf] : []).some((n) => o.has(n)))
            if (typeof e.onReset == "function")
              e.onReset({ row: t, col: e, changedFields: Array.from(o) });
            else {
              const n = v(e);
              n && (t[n] = null);
            }
        });
      },
      { deep: !1 }
    );
    C.set(t, f);
  }, B = (t) => {
    t._isNew ? l.value = l.value.filter((f) => f !== t) : t._backup && (Object.assign(t, t._backup), delete t._backup);
    const u = C.get(t);
    u && u(), C.delete(t), m.value.delete(t), b("update:modelValue", [...l.value]);
  }, W = async (t) => {
    var h, r, c;
    const u = (d.columns || []).find((o) => {
      if (!o || o.name === "actions" || !F(o, t) || !j(o, t) || U(o, t) || D(o, t)) return !1;
      const e = v(o), a = e ? t[e] : void 0;
      return a == null || a === "";
    });
    if (u) {
      const o = u.label || u.name;
      (h = d.confirmError) == null || h.call(d, `O campo "${o}" é obrigatório.`);
      return;
    }
    const f = (d.columns || []).filter((o) => o.uniqueKey);
    if (f.length > 0) {
      const o = (i) => f.map((y) => i[v(y)] ?? "").join("|"), e = o(t);
      if (l.value.filter((i) => o(i) === e).length - 1 > 0) {
        b("validation-error", {
          kind: "unique",
          fields: f.map((i) => v(i)),
          labels: f.map((i) => i.label || i.name),
          values: f.map((i) => t[v(i)]),
          row: t
        });
        return;
      }
    }
    try {
      const o = await new Promise((e, a) => {
        b("save", t, { resolve: e, reject: a });
      });
      Object.assign(t, o), delete t._backup, delete t._isNew, (r = C.get(t)) == null || r(), C.delete(t), m.value.delete(t), b("update:modelValue", [...l.value]);
    } catch (o) {
      const e = o && o.message ? o.message : "Erro ao salvar a linha.";
      (c = d.confirmError) == null || c.call(d, e), console.error("Erro ao salvar a linha:", o);
    }
  }, x = async (t) => {
    var u, f;
    if (m.value.size > 0 && !q(t)) {
      (u = d.confirmError) == null || u.call(d, "Termine a edição atual antes de apagar outro registo.");
      return;
    }
    try {
      if (!await ((f = d.confirmDelete) == null ? void 0 : f.call(
        d,
        "Deseja realmente apagar este registo? Esta ação não poderá ser desfeita."
      ))) return;
      await new Promise((c, o) => {
        b("delete", t, { resolve: c, reject: o });
      });
      const r = C.get(t);
      r && r(), C.delete(t), l.value = l.value.filter((c) => c !== t), m.value.delete(t), b("update:modelValue", [...l.value]);
    } catch (h) {
      console.error("Erro ao apagar a linha:", h);
    }
  };
  return P(A, (t) => {
    b("editing-change", !!t);
  }, { immediate: !0 }), {
    rows: l,
    editingRows: m,
    isEditing: q,
    isEditingAnyRow: A,
    addRow: L,
    editRow: z,
    cancelEdit: B,
    saveRow: W,
    deleteRow: x,
    search: (t) => b("search", (t || "").trim()),
    toggleStatus: (t) => b("toggle-status", t),
    visibleColumns: S
  };
}
const be = { class: "text-subtitle2 text-primary" }, Ce = {
  key: 0,
  style: { width: "100%" }
}, ke = { key: 0 }, Ee = {
  key: 1,
  class: "q-gutter-sm"
}, ve = {
  __name: "EditableTable",
  props: {
    title: String,
    modelValue: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    // ✅ ÚNICO ponto de entrada para options dos selects
    // Ex: { provinceOptions: [...], districtOptions: [...], partnerOptions: [...] }
    selectOptions: { type: Object, default: () => ({}) },
    loading: Boolean,
    pagination: Object,
    rowsPerPageOptions: { type: Array, default: () => [10, 20, 50, 100] },
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
    extraActions: { type: Array, default: () => [] }
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
    "custom-action",
    "validation-error",
    "editing-change"
  ],
  setup(d, { emit: b }) {
    var f, h, r, c, o;
    const l = d, C = b, E = K(""), m = K({
      sortBy: ((f = l.pagination) == null ? void 0 : f.sortBy) ?? "id",
      descending: ((h = l.pagination) == null ? void 0 : h.descending) ?? !1,
      page: ((r = l.pagination) == null ? void 0 : r.page) ?? 1,
      rowsPerPage: ((c = l.pagination) == null ? void 0 : c.rowsPerPage) ?? 10,
      rowsNumber: ((o = l.pagination) == null ? void 0 : o.rowsNumber) ?? 0
    });
    P(
      () => l.pagination,
      (e) => {
        m.value = {
          sortBy: (e == null ? void 0 : e.sortBy) ?? "id",
          descending: (e == null ? void 0 : e.descending) ?? !1,
          page: (e == null ? void 0 : e.page) ?? 1,
          rowsPerPage: (e == null ? void 0 : e.rowsPerPage) ?? 10,
          rowsNumber: (e == null ? void 0 : e.rowsNumber) ?? 0
        };
      }
    ), P(
      () => {
        var e;
        return (e = l.pagination) == null ? void 0 : e.rowsNumber;
      },
      (e) => {
        m.value.rowsNumber = e ?? 0;
      }
    );
    const {
      rows: q,
      isEditing: A,
      isEditingAnyRow: S,
      addRow: T,
      editRow: F,
      cancelEdit: U,
      saveRow: D,
      deleteRow: j,
      search: v,
      toggleStatus: L,
      visibleColumns: z
    } = he(l, C), B = (e, a) => typeof e == "function" ? !!e({ row: a, props: l }) : !!e, W = (e, a) => (e.editable === void 0 ? !0 : B(e.editable, a)) && !B(e.hideInEdit, a) && !!e.editType, x = (e, a) => B(e == null ? void 0 : e.disabled, a), N = (e, a) => B(e == null ? void 0 : e.readonly, a), Z = Y(() => (e) => (l.extraActions || []).filter(
      (a) => typeof a.visible == "function" ? a.visible(e) : a.visible !== !1
    )), t = (e) => {
      m.value = {
        ...e.pagination,
        rowsNumber: m.value.rowsNumber
      }, C("request", e);
    }, u = (e, a) => {
      var n;
      if (e.editType === "select") {
        let i = [];
        if (Array.isArray(e.editOptions) && (i = e.editOptions), !i.length && typeof e.editOptions == "function") {
          const y = e.editOptions({ row: a, props: l });
          Array.isArray(y) && (i = y);
        }
        if (!i.length && e.editOptionsKey && (i = ((n = l.selectOptions) == null ? void 0 : n[e.editOptionsKey]) || []), e.dependsOn && e.matchField) {
          const y = a[e.dependsOn];
          i = i.filter((w) => w[e.matchField] === y);
        }
        return {
          options: i,
          optionValue: e.optionValueKey || "value",
          optionLabel: e.optionLabelKey || "label",
          emitValue: !0,
          mapOptions: !0,
          dense: !0,
          outlined: !0,
          placeholder: e.placeholder || "Selecionar",
          disable: x(e, a),
          readonly: N(e, a),
          multiple: !!e.multiple,
          useChips: !!e.multiple
        };
      }
      return e.editType === "toggle" ? {
        dense: !0,
        keepColor: !0,
        color: "primary",
        disable: x(e, a),
        readonly: N(e, a)
      } : {
        dense: !0,
        outlined: !0,
        placeholder: e.placeholder || e.label,
        disable: x(e, a),
        readonly: N(e, a)
      };
    };
    return (e, a) => (g(), k(s(ne), {
      class: "q-pa-none",
      flat: "",
      bordered: ""
    }, {
      default: p(() => [
        O(s(H), { class: "text-h6 q-pa-none" }, {
          default: p(() => [
            O(s(ae), {
              dense: "",
              "inline-actions": "",
              class: "text-primary bg-grey-3"
            }, {
              action: p(() => [
                l.hideSearchInput ? _("", !0) : (g(), k(s(J), {
                  key: 0,
                  outlined: "",
                  label: "Pesquisar por Nome, descrição, Código",
                  dense: "",
                  style: { width: "300px" },
                  color: "white",
                  modelValue: E.value,
                  "onUpdate:modelValue": a[1] || (a[1] = (n) => E.value = n),
                  onKeyup: a[2] || (a[2] = me((n) => s(v)(E.value), ["enter"])),
                  disable: s(S)
                }, {
                  append: p(() => [
                    E.value ? (g(), k(s(ie), {
                      key: 0,
                      name: "close",
                      onClick: a[0] || (a[0] = () => {
                        E.value = "", s(v)("");
                      }),
                      class: "cursor-pointer"
                    })) : _("", !0)
                  ]),
                  _: 1
                }, 8, ["modelValue", "disable"])),
                l.hideSearchButton ? _("", !0) : (g(), k(s(V), {
                  key: 1,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "search",
                  onClick: a[3] || (a[3] = (n) => s(v)(E.value)),
                  disable: s(S),
                  class: "q-ml-sm"
                }, {
                  default: p(() => [
                    O(s(I), { class: "bg-primary" }, {
                      default: p(() => a[6] || (a[6] = [
                        Q("Pesquisar")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                l.hideAddButton ? _("", !0) : (g(), k(s(V), {
                  key: 2,
                  outline: "",
                  style: { color: "goldenrod" },
                  dense: "",
                  icon: "add",
                  class: "q-ml-sm",
                  onClick: a[4] || (a[4] = (n) => l.useExternalAdd ? C("add") : s(T)()),
                  disable: s(S)
                }, {
                  default: p(() => [
                    O(s(I), { class: "bg-primary" }, {
                      default: p(() => [
                        Q("Criar novos " + $(l.title), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["disable"])),
                ge(e.$slots, "action-buttons")
              ]),
              default: p(() => [
                ce("span", be, $(l.title), 1)
              ]),
              _: 3
            })
          ]),
          _: 3
        }),
        O(s(H), { class: "q-pa-md" }, {
          default: p(() => [
            O(s(se), {
              rows: s(q),
              columns: l.columns,
              "row-key": "id",
              flat: "",
              dense: "",
              separator: "horizontal",
              pagination: m.value,
              "onUpdate:pagination": a[5] || (a[5] = (n) => m.value = n),
              "rows-per-page-options": l.rowsPerPageOptions,
              "pagination-label": (n, i, y) => `${n}-${i} de ${y} registros`,
              onRequest: t
            }, ye({
              "body-cell-actions": p(({ row: n }) => [
                O(s(X), { class: "text-center" }, {
                  default: p(() => [
                    s(A)(n) ? (g(), R("div", ke, [
                      O(s(V), {
                        dense: "",
                        flat: "",
                        icon: "check",
                        color: "green",
                        onClick: (i) => s(D)(n)
                      }, null, 8, ["onClick"]),
                      O(s(V), {
                        dense: "",
                        flat: "",
                        icon: "close",
                        color: "orange",
                        onClick: (i) => s(U)(n)
                      }, null, 8, ["onClick"])
                    ])) : (g(), R("div", Ee, [
                      l.hideToggleStatus ? _("", !0) : (g(), k(s(V), {
                        key: 0,
                        dense: "",
                        flat: "",
                        icon: n.lifeCycleStatus === "ACTIVE" ? "toggle_on" : "toggle_off",
                        color: n.lifeCycleStatus === "ACTIVE" ? "green" : "grey",
                        onClick: (i) => s(L)(n),
                        disable: s(S)
                      }, null, 8, ["icon", "color", "onClick", "disable"])),
                      l.hideEdit ? _("", !0) : (g(), k(s(V), {
                        key: 1,
                        dense: "",
                        flat: "",
                        icon: "edit",
                        color: "primary",
                        onClick: (i) => l.useExternalEdit ? C("edit", n) : s(F)(n)
                      }, null, 8, ["onClick"])),
                      l.hideDelete ? _("", !0) : (g(), k(s(V), {
                        key: 2,
                        dense: "",
                        flat: "",
                        icon: "delete",
                        color: "red",
                        onClick: (i) => s(j)(n)
                      }, null, 8, ["onClick"])),
                      (g(!0), R(ee, null, te(Z.value(n), (i, y) => (g(), k(s(V), {
                        key: y,
                        dense: "",
                        flat: "",
                        icon: i.icon,
                        color: i.color || "primary",
                        onClick: (w) => C(i.emit || "extra-action", n)
                      }, {
                        default: p(() => [
                          O(s(I), { class: "bg-primary" }, {
                            default: p(() => [
                              Q($(i.tooltip), 1)
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
              te(s(z), (n) => ({
                name: `body-cell-${n.name}`,
                fn: p(({ row: i }) => [
                  O(s(X), {
                    style: pe(n.style),
                    class: "q-pa-xs"
                  }, {
                    default: p(() => [
                      s(A)(i) && W(n, i) ? (g(), R("div", Ce, [
                        n.editType === "select" ? (g(), k(s(le), G({
                          key: 0,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (y) => i[n.editValueField || n.field] = y
                        }, u(n, i), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"])) : n.editType === "toggle" ? (g(), k(s(de), G({
                          key: 1,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (y) => i[n.editValueField || n.field] = y
                        }, u(n, i)), null, 16, ["modelValue", "onUpdate:modelValue"])) : (g(), k(s(J), G({
                          key: 2,
                          modelValue: i[n.editValueField || n.field],
                          "onUpdate:modelValue": (y) => i[n.editValueField || n.field] = y
                        }, u(n, i), { class: "full-width" }), null, 16, ["modelValue", "onUpdate:modelValue"]))
                      ])) : (g(), R(ee, { key: 1 }, [
                        Q($(typeof n.field == "function" ? n.field(i) : i[n.field] ?? "—"), 1)
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
}, Ae = {
  install(d) {
    d.use(oe, {
      components: {
        QCard: ne,
        QCardSection: H,
        QBanner: ae,
        QInput: J,
        QIcon: ie,
        QBtn: V,
        QTable: se,
        QTd: X,
        QSelect: le,
        QToggle: de,
        QTooltip: I
      }
    }), d.component("EditableTable", ve);
  }
};
export {
  ve as EditableTable,
  Ae as default
};
