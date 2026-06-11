-- =============================================================================
-- WEBOSS Seller Area — Initial Schema
-- Tables: profiles, stores, products, subscriptions
-- Includes: updated_at triggers, new-user profile trigger, RLS policies
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Shared updated_at trigger ----------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- profiles  (1:1 with auth.users)
-- =============================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text,
  email        text,
  avatar_url   text,
  phone        text,
  onboarding_completed boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Seller user profile, extends auth.users.';

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- stores
-- =============================================================================
create table if not exists public.stores (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users (id) on delete cascade,
  name              text not null,
  slug              text unique,
  description       text,
  logo_url          text,
  brand_color       text not null default '#d6266f',
  template_id       text not null default 'aurora',
  setup_method      text not null default 'manual' check (setup_method in ('manual', 'import')),
  import_source_url text,
  subdomain         text unique,
  custom_domain     text unique,
  status            text not null default 'draft' check (status in ('draft', 'active', 'suspended')),
  onboarding_step   text not null default 'method',
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.stores is 'A seller storefront. One owner can have multiple stores.';

create index if not exists idx_stores_owner_id on public.stores (owner_id);
create index if not exists idx_stores_slug on public.stores (slug);
create index if not exists idx_stores_status on public.stores (status);

drop trigger if exists trg_stores_updated_at on public.stores;
create trigger trg_stores_updated_at
  before update on public.stores
  for each row execute function public.set_updated_at();

-- =============================================================================
-- products
-- =============================================================================
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid not null references public.stores (id) on delete cascade,
  name        text not null,
  description text,
  price       numeric(12, 2) not null default 0,
  compare_at_price numeric(12, 2),
  currency    text not null default 'IDR',
  image_url   text,
  sku         text,
  stock       integer not null default 0,
  status      text not null default 'active' check (status in ('active', 'draft', 'archived')),
  sort_order  integer not null default 0,
  ai_imported boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.products is 'Products belonging to a store.';

create index if not exists idx_products_store_id on public.products (store_id);
create index if not exists idx_products_status on public.products (status);

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- subscriptions  (one active plan per store)
-- =============================================================================
create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  store_id           uuid not null references public.stores (id) on delete cascade,
  owner_id           uuid not null references auth.users (id) on delete cascade,
  plan               text not null default 'basic' check (plan in ('basic', 'pro')),
  price              numeric(12, 2) not null default 75000,
  currency           text not null default 'IDR',
  billing_interval   text not null default 'month' check (billing_interval in ('month', 'year')),
  status             text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'canceled')),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.subscriptions is 'Plan/subscription chosen by the seller for a store.';

create unique index if not exists uniq_subscriptions_store on public.subscriptions (store_id);
create index if not exists idx_subscriptions_owner_id on public.subscriptions (owner_id);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table public.profiles      enable row level security;
alter table public.stores        enable row level security;
alter table public.products      enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: owner can read / update their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- stores: public can read active stores; owner manages own stores
drop policy if exists "stores_select_public_active" on public.stores;
create policy "stores_select_public_active" on public.stores
  for select using (status = 'active' or auth.uid() = owner_id);

drop policy if exists "stores_insert_own" on public.stores;
create policy "stores_insert_own" on public.stores
  for insert with check (auth.uid() = owner_id);

drop policy if exists "stores_update_own" on public.stores;
create policy "stores_update_own" on public.stores
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "stores_delete_own" on public.stores;
create policy "stores_delete_own" on public.stores
  for delete using (auth.uid() = owner_id);

-- products: public can read products of active stores; owner manages own
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = products.store_id
        and (s.status = 'active' or s.owner_id = auth.uid())
    )
  );

drop policy if exists "products_write_own" on public.products;
create policy "products_write_own" on public.products
  for all using (
    exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.stores s where s.id = products.store_id and s.owner_id = auth.uid())
  );

-- subscriptions: owner-only
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = owner_id);

drop policy if exists "subscriptions_write_own" on public.subscriptions;
create policy "subscriptions_write_own" on public.subscriptions
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
