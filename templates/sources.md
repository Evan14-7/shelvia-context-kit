<!--
  Template: Trusted Sources
  Renders: sources[] (label, url, trust_grade, bound_claim)
  Repeat the block below once per source. The trust_grade tells the reader how
  much to lean on each source; it is a plain grade, never a percentage.
  Grades: primary | reputable | community | unverified.
-->

## Trusted Sources

<!-- when sources is empty: -->
_(none captured yet)_

<!-- for each source: -->
- [{{label}}]({{url}}) — _{{trust_grade}}_
  <!-- only when bound_claim is present: -->
  - Backs: {{bound_claim}}
