export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_history: {
        Row: {
          created_at: string | null;
          engine: string;
          full_result: string | null;
          id: string;
          mode: string;
          model: string;
          payload: Json | null;
          prompt_summary: string;
          provider: string;
          result_summary: string | null;
          saved_destination: string | null;
          updated_at: string | null;
          user_id: string | null;
          workspace_key: string | null;
        };
        Insert: {
          created_at?: string | null;
          engine: string;
          full_result?: string | null;
          id?: string;
          mode: string;
          model: string;
          payload?: Json | null;
          prompt_summary: string;
          provider: string;
          result_summary?: string | null;
          saved_destination?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workspace_key?: string | null;
        };
        Update: {
          created_at?: string | null;
          engine?: string;
          full_result?: string | null;
          id?: string;
          mode?: string;
          model?: string;
          payload?: Json | null;
          prompt_summary?: string;
          provider?: string;
          result_summary?: string | null;
          saved_destination?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          workspace_key?: string | null;
        };
        Relationships: [];
      };
      amtme_automation_matrix: {
        Row: {
          automation_code: string;
          created_at: string | null;
          department: string;
          human_review_required: boolean;
          id: string;
          input_data: Json;
          name: string;
          next_action: string | null;
          output_data: Json;
          priority: string;
          risk: string | null;
          status: string;
          tool_stack: Json;
          trigger_description: string;
          trigger_type: string;
          updated_at: string | null;
        };
        Insert: {
          automation_code: string;
          created_at?: string | null;
          department: string;
          human_review_required?: boolean;
          id?: string;
          input_data?: Json;
          name: string;
          next_action?: string | null;
          output_data?: Json;
          priority?: string;
          risk?: string | null;
          status?: string;
          tool_stack?: Json;
          trigger_description: string;
          trigger_type: string;
          updated_at?: string | null;
        };
        Update: {
          automation_code?: string;
          created_at?: string | null;
          department?: string;
          human_review_required?: boolean;
          id?: string;
          input_data?: Json;
          name?: string;
          next_action?: string | null;
          output_data?: Json;
          priority?: string;
          risk?: string | null;
          status?: string;
          tool_stack?: Json;
          trigger_description?: string;
          trigger_type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_collaboration_criteria: {
        Row: {
          created_at: string | null;
          criterion: string;
          criterion_type: string;
          id: string;
          rationale: string;
          severity: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          criterion: string;
          criterion_type: string;
          id?: string;
          rationale: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          criterion?: string;
          criterion_type?: string;
          id?: string;
          rationale?: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_conversion_flows: {
        Row: {
          created_at: string | null;
          flow_code: string;
          follow_up: string | null;
          id: string;
          name: string;
          required_fields: Json;
          source_channel: string;
          status: string;
          steps: Json;
          success_event: string;
          trigger_message: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          flow_code: string;
          follow_up?: string | null;
          id?: string;
          name: string;
          required_fields?: Json;
          source_channel: string;
          status?: string;
          steps?: Json;
          success_event: string;
          trigger_message: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          flow_code?: string;
          follow_up?: string | null;
          id?: string;
          name?: string;
          required_fields?: Json;
          source_channel?: string;
          status?: string;
          steps?: Json;
          success_event?: string;
          trigger_message?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_data_audit_log: {
        Row: {
          area: string;
          created_at: string | null;
          criticality: string;
          current_status: string;
          destination_table: string;
          gap_description: string | null;
          id: string;
          next_action: string | null;
          records_expected: number | null;
          records_loaded: number | null;
          source_name: string;
          updated_at: string | null;
        };
        Insert: {
          area: string;
          created_at?: string | null;
          criticality?: string;
          current_status: string;
          destination_table: string;
          gap_description?: string | null;
          id?: string;
          next_action?: string | null;
          records_expected?: number | null;
          records_loaded?: number | null;
          source_name: string;
          updated_at?: string | null;
        };
        Update: {
          area?: string;
          created_at?: string | null;
          criticality?: string;
          current_status?: string;
          destination_table?: string;
          gap_description?: string | null;
          id?: string;
          next_action?: string | null;
          records_expected?: number | null;
          records_loaded?: number | null;
          source_name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_deploy_governance: {
        Row: {
          area: string;
          created_at: string | null;
          current_state: string;
          id: string;
          item_name: string;
          notes: string | null;
          owner: string;
          required_action: string;
          risk_level: string;
          status: string;
          updated_at: string | null;
          verification_method: string;
        };
        Insert: {
          area: string;
          created_at?: string | null;
          current_state: string;
          id?: string;
          item_name: string;
          notes?: string | null;
          owner?: string;
          required_action: string;
          risk_level?: string;
          status?: string;
          updated_at?: string | null;
          verification_method: string;
        };
        Update: {
          area?: string;
          created_at?: string | null;
          current_state?: string;
          id?: string;
          item_name?: string;
          notes?: string | null;
          owner?: string;
          required_action?: string;
          risk_level?: string;
          status?: string;
          updated_at?: string | null;
          verification_method?: string;
        };
        Relationships: [];
      };
      amtme_environment_registry: {
        Row: {
          created_at: string | null;
          environment_name: string;
          id: string;
          notes: string | null;
          public_safe: boolean;
          required: boolean;
          service: string;
          status: string;
          storage_location: string;
          updated_at: string | null;
          variable_name: string;
          variable_purpose: string;
        };
        Insert: {
          created_at?: string | null;
          environment_name: string;
          id?: string;
          notes?: string | null;
          public_safe?: boolean;
          required?: boolean;
          service: string;
          status?: string;
          storage_location: string;
          updated_at?: string | null;
          variable_name: string;
          variable_purpose: string;
        };
        Update: {
          created_at?: string | null;
          environment_name?: string;
          id?: string;
          notes?: string | null;
          public_safe?: boolean;
          required?: boolean;
          service?: string;
          status?: string;
          storage_location?: string;
          updated_at?: string | null;
          variable_name?: string;
          variable_purpose?: string;
        };
        Relationships: [];
      };
      amtme_ingestion_phases: {
        Row: {
          acceptance_criteria: Json;
          completed_at: string | null;
          created_at: string | null;
          destination_scope: string;
          id: string;
          notes: string | null;
          objective: string;
          phase_code: string;
          phase_order: number;
          risk_level: string;
          source_scope: string;
          started_at: string | null;
          status: string;
          title: string;
          updated_at: string | null;
          verification_query: string | null;
        };
        Insert: {
          acceptance_criteria?: Json;
          completed_at?: string | null;
          created_at?: string | null;
          destination_scope: string;
          id?: string;
          notes?: string | null;
          objective: string;
          phase_code: string;
          phase_order: number;
          risk_level?: string;
          source_scope: string;
          started_at?: string | null;
          status?: string;
          title: string;
          updated_at?: string | null;
          verification_query?: string | null;
        };
        Update: {
          acceptance_criteria?: Json;
          completed_at?: string | null;
          created_at?: string | null;
          destination_scope?: string;
          id?: string;
          notes?: string | null;
          objective?: string;
          phase_code?: string;
          phase_order?: number;
          risk_level?: string;
          source_scope?: string;
          started_at?: string | null;
          status?: string;
          title?: string;
          updated_at?: string | null;
          verification_query?: string | null;
        };
        Relationships: [];
      };
      amtme_kpi_targets: {
        Row: {
          area: string;
          cadence: string;
          created_at: string | null;
          id: string;
          kpi_name: string;
          owner: string | null;
          status: string;
          target_unit: string | null;
          target_value: number | null;
          threshold_green: string | null;
          threshold_red: string | null;
          threshold_yellow: string | null;
          updated_at: string | null;
        };
        Insert: {
          area: string;
          cadence: string;
          created_at?: string | null;
          id?: string;
          kpi_name: string;
          owner?: string | null;
          status?: string;
          target_unit?: string | null;
          target_value?: number | null;
          threshold_green?: string | null;
          threshold_red?: string | null;
          threshold_yellow?: string | null;
          updated_at?: string | null;
        };
        Update: {
          area?: string;
          cadence?: string;
          created_at?: string | null;
          id?: string;
          kpi_name?: string;
          owner?: string | null;
          status?: string;
          target_unit?: string | null;
          target_value?: number | null;
          threshold_green?: string | null;
          threshold_red?: string | null;
          threshold_yellow?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_metric_alerts: {
        Row: {
          action: string;
          alert_name: string;
          area: string;
          condition: string;
          created_at: string | null;
          id: string;
          severity: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          action: string;
          alert_name: string;
          area: string;
          condition: string;
          created_at?: string | null;
          id?: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          action?: string;
          alert_name?: string;
          area?: string;
          condition?: string;
          created_at?: string | null;
          id?: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_metric_sources: {
        Row: {
          action_required: string | null;
          confidence_level: string;
          created_at: string | null;
          data_status: string;
          id: string;
          metric_name: string;
          metric_unit: string | null;
          metric_value: number | null;
          period_end: string | null;
          period_label: string | null;
          period_start: string | null;
          platform: string;
          source_name: string;
          source_note: string | null;
          updated_at: string | null;
        };
        Insert: {
          action_required?: string | null;
          confidence_level?: string;
          created_at?: string | null;
          data_status?: string;
          id?: string;
          metric_name: string;
          metric_unit?: string | null;
          metric_value?: number | null;
          period_end?: string | null;
          period_label?: string | null;
          period_start?: string | null;
          platform: string;
          source_name: string;
          source_note?: string | null;
          updated_at?: string | null;
        };
        Update: {
          action_required?: string | null;
          confidence_level?: string;
          created_at?: string | null;
          data_status?: string;
          id?: string;
          metric_name?: string;
          metric_unit?: string | null;
          metric_value?: number | null;
          period_end?: string | null;
          period_label?: string | null;
          period_start?: string | null;
          platform?: string;
          source_name?: string;
          source_note?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_monetization_roadmap: {
        Row: {
          activation_actions: Json;
          created_at: string | null;
          expected_revenue_mxn: number | null;
          expected_revenue_usd: number | null;
          id: string;
          objective: string;
          primary_offer: string | null;
          risks: Json;
          stage_code: string;
          stage_order: number;
          status: string;
          success_criteria: Json;
          timeframe: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          activation_actions?: Json;
          created_at?: string | null;
          expected_revenue_mxn?: number | null;
          expected_revenue_usd?: number | null;
          id?: string;
          objective: string;
          primary_offer?: string | null;
          risks?: Json;
          stage_code: string;
          stage_order: number;
          status?: string;
          success_criteria?: Json;
          timeframe: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          activation_actions?: Json;
          created_at?: string | null;
          expected_revenue_mxn?: number | null;
          expected_revenue_usd?: number | null;
          id?: string;
          objective?: string;
          primary_offer?: string | null;
          risks?: Json;
          stage_code?: string;
          stage_order?: number;
          status?: string;
          success_criteria?: Json;
          timeframe?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_offers: {
        Row: {
          audience: string;
          boundaries: Json;
          capacity: string | null;
          conversion_channel: string;
          created_at: string | null;
          cta: string;
          deliverables: Json;
          delivery_format: string | null;
          description: string;
          id: string;
          name: string;
          notes: string | null;
          offer_code: string;
          offer_type: string;
          price_mxn: number | null;
          price_usd: number | null;
          priority: string;
          promise: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          audience: string;
          boundaries?: Json;
          capacity?: string | null;
          conversion_channel: string;
          created_at?: string | null;
          cta: string;
          deliverables?: Json;
          delivery_format?: string | null;
          description: string;
          id?: string;
          name: string;
          notes?: string | null;
          offer_code: string;
          offer_type: string;
          price_mxn?: number | null;
          price_usd?: number | null;
          priority?: string;
          promise: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          audience?: string;
          boundaries?: Json;
          capacity?: string | null;
          conversion_channel?: string;
          created_at?: string | null;
          cta?: string;
          deliverables?: Json;
          delivery_format?: string | null;
          description?: string;
          id?: string;
          name?: string;
          notes?: string | null;
          offer_code?: string;
          offer_type?: string;
          price_mxn?: number | null;
          price_usd?: number | null;
          priority?: string;
          promise?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_phase_artifacts: {
        Row: {
          app_surface: string | null;
          artifact_name: string;
          artifact_type: string;
          created_at: string | null;
          id: string;
          notes: string | null;
          phase_code: string;
          repository_path: string | null;
          status: string;
          supabase_table: string | null;
          updated_at: string | null;
        };
        Insert: {
          app_surface?: string | null;
          artifact_name: string;
          artifact_type: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          phase_code: string;
          repository_path?: string | null;
          status?: string;
          supabase_table?: string | null;
          updated_at?: string | null;
        };
        Update: {
          app_surface?: string | null;
          artifact_name?: string;
          artifact_type?: string;
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          phase_code?: string;
          repository_path?: string | null;
          status?: string;
          supabase_table?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'amtme_phase_artifacts_phase_code_fkey';
            columns: ['phase_code'];
            isOneToOne: false;
            referencedRelation: 'amtme_ingestion_phases';
            referencedColumns: ['phase_code'];
          },
        ];
      };
      amtme_prompt_library: {
        Row: {
          created_at: string | null;
          format_code: string | null;
          id: string;
          negative_prompt: string | null;
          objective: string;
          prompt_code: string;
          prompt_text: string;
          prompt_type: string;
          status: string;
          title: string;
          updated_at: string | null;
          variables: Json;
        };
        Insert: {
          created_at?: string | null;
          format_code?: string | null;
          id?: string;
          negative_prompt?: string | null;
          objective: string;
          prompt_code: string;
          prompt_text: string;
          prompt_type: string;
          status?: string;
          title: string;
          updated_at?: string | null;
          variables?: Json;
        };
        Update: {
          created_at?: string | null;
          format_code?: string | null;
          id?: string;
          negative_prompt?: string | null;
          objective?: string;
          prompt_code?: string;
          prompt_text?: string;
          prompt_type?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
          variables?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'amtme_prompt_library_format_code_fkey';
            columns: ['format_code'];
            isOneToOne: false;
            referencedRelation: 'amtme_visual_formats';
            referencedColumns: ['format_code'];
          },
        ];
      };
      amtme_ready_criteria: {
        Row: {
          area: string;
          blocker_definition: string;
          created_at: string | null;
          id: string;
          item_name: string;
          owner: string;
          ready_definition: string;
          severity: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          area: string;
          blocker_definition: string;
          created_at?: string | null;
          id?: string;
          item_name: string;
          owner?: string;
          ready_definition: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          area?: string;
          blocker_definition?: string;
          created_at?: string | null;
          id?: string;
          item_name?: string;
          owner?: string;
          ready_definition?: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_release_checklist: {
        Row: {
          blocker_if_fails: boolean;
          command_or_action: string;
          created_at: string | null;
          expected_result: string;
          id: string;
          notes: string | null;
          status: string;
          step_name: string;
          step_order: number;
          updated_at: string | null;
        };
        Insert: {
          blocker_if_fails?: boolean;
          command_or_action: string;
          created_at?: string | null;
          expected_result: string;
          id?: string;
          notes?: string | null;
          status?: string;
          step_name: string;
          step_order: number;
          updated_at?: string | null;
        };
        Update: {
          blocker_if_fails?: boolean;
          command_or_action?: string;
          created_at?: string | null;
          expected_result?: string;
          id?: string;
          notes?: string | null;
          status?: string;
          step_name?: string;
          step_order?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_sops: {
        Row: {
          cadence: string;
          created_at: string | null;
          department: string;
          failure_modes: Json;
          id: string;
          inputs: Json;
          objective: string;
          outputs: Json;
          owner: string;
          ready_criteria: Json;
          sop_code: string;
          status: string;
          steps: Json;
          title: string;
          trigger_event: string;
          updated_at: string | null;
        };
        Insert: {
          cadence: string;
          created_at?: string | null;
          department: string;
          failure_modes?: Json;
          id?: string;
          inputs?: Json;
          objective: string;
          outputs?: Json;
          owner?: string;
          ready_criteria?: Json;
          sop_code: string;
          status?: string;
          steps?: Json;
          title: string;
          trigger_event: string;
          updated_at?: string | null;
        };
        Update: {
          cadence?: string;
          created_at?: string | null;
          department?: string;
          failure_modes?: Json;
          id?: string;
          inputs?: Json;
          objective?: string;
          outputs?: Json;
          owner?: string;
          ready_criteria?: Json;
          sop_code?: string;
          status?: string;
          steps?: Json;
          title?: string;
          trigger_event?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_visual_formats: {
        Row: {
          aspect_ratio: string;
          created_at: string | null;
          export_spec: string;
          format_code: string;
          grid_columns: number | null;
          gutter_px: number | null;
          height_px: number;
          id: string;
          platform: string;
          safe_bottom_px: number | null;
          safe_left_px: number | null;
          safe_right_px: number | null;
          safe_top_px: number | null;
          status: string;
          updated_at: string | null;
          use_case: string;
          width_px: number;
        };
        Insert: {
          aspect_ratio: string;
          created_at?: string | null;
          export_spec: string;
          format_code: string;
          grid_columns?: number | null;
          gutter_px?: number | null;
          height_px: number;
          id?: string;
          platform: string;
          safe_bottom_px?: number | null;
          safe_left_px?: number | null;
          safe_right_px?: number | null;
          safe_top_px?: number | null;
          status?: string;
          updated_at?: string | null;
          use_case: string;
          width_px: number;
        };
        Update: {
          aspect_ratio?: string;
          created_at?: string | null;
          export_spec?: string;
          format_code?: string;
          grid_columns?: number | null;
          gutter_px?: number | null;
          height_px?: number;
          id?: string;
          platform?: string;
          safe_bottom_px?: number | null;
          safe_left_px?: number | null;
          safe_right_px?: number | null;
          safe_top_px?: number | null;
          status?: string;
          updated_at?: string | null;
          use_case?: string;
          width_px?: number;
        };
        Relationships: [];
      };
      amtme_visual_identity_versions: {
        Row: {
          activated_at: string | null;
          created_at: string | null;
          deactivated_at: string | null;
          id: string;
          notes: string | null;
          source_reference: string;
          status: string;
          summary: string;
          title: string;
          updated_at: string | null;
          version_code: string;
        };
        Insert: {
          activated_at?: string | null;
          created_at?: string | null;
          deactivated_at?: string | null;
          id?: string;
          notes?: string | null;
          source_reference: string;
          status?: string;
          summary: string;
          title: string;
          updated_at?: string | null;
          version_code: string;
        };
        Update: {
          activated_at?: string | null;
          created_at?: string | null;
          deactivated_at?: string | null;
          id?: string;
          notes?: string | null;
          source_reference?: string;
          status?: string;
          summary?: string;
          title?: string;
          updated_at?: string | null;
          version_code?: string;
        };
        Relationships: [];
      };
      amtme_visual_qa_criteria: {
        Row: {
          created_at: string | null;
          criterion_area: string;
          criterion_name: string;
          failure_condition: string;
          id: string;
          ready_condition: string;
          severity: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          criterion_area: string;
          criterion_name: string;
          failure_condition: string;
          id?: string;
          ready_condition: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          criterion_area?: string;
          criterion_name?: string;
          failure_condition?: string;
          id?: string;
          ready_condition?: string;
          severity?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_visual_rules: {
        Row: {
          applies_to: string;
          created_at: string | null;
          id: string;
          priority: string;
          rule_description: string;
          rule_group: string;
          rule_name: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          applies_to: string;
          created_at?: string | null;
          id?: string;
          priority?: string;
          rule_description: string;
          rule_group: string;
          rule_name: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          applies_to?: string;
          created_at?: string | null;
          id?: string;
          priority?: string;
          rule_description?: string;
          rule_group?: string;
          rule_name?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      amtme_visual_tokens: {
        Row: {
          created_at: string | null;
          id: string;
          status: string;
          token_name: string;
          token_type: string;
          token_value: string;
          updated_at: string | null;
          usage_rule: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          status?: string;
          token_name: string;
          token_type: string;
          token_value: string;
          updated_at?: string | null;
          usage_rule: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          status?: string;
          token_name?: string;
          token_type?: string;
          token_value?: string;
          updated_at?: string | null;
          usage_rule?: string;
        };
        Relationships: [];
      };
      amtme_weekly_rituals: {
        Row: {
          checklist: Json;
          created_at: string | null;
          duration_minutes: number | null;
          expected_output: string;
          id: string;
          objective: string;
          recommended_time: string | null;
          ritual_code: string;
          status: string;
          title: string;
          updated_at: string | null;
          weekday: string;
        };
        Insert: {
          checklist?: Json;
          created_at?: string | null;
          duration_minutes?: number | null;
          expected_output: string;
          id?: string;
          objective: string;
          recommended_time?: string | null;
          ritual_code: string;
          status?: string;
          title: string;
          updated_at?: string | null;
          weekday: string;
        };
        Update: {
          checklist?: Json;
          created_at?: string | null;
          duration_minutes?: number | null;
          expected_output?: string;
          id?: string;
          objective?: string;
          recommended_time?: string | null;
          ritual_code?: string;
          status?: string;
          title?: string;
          updated_at?: string | null;
          weekday?: string;
        };
        Relationships: [];
      };
      app_config: {
        Row: {
          active_channels: Json | null;
          active_formats: Json | null;
          ai_enabled: boolean | null;
          ai_fallback_provider: string | null;
          ai_primary_provider: string | null;
          ai_quality_rules: Json | null;
          ai_system_prompt: string | null;
          ai_tone: string | null;
          created_at: string | null;
          frequent_ctas: Json | null;
          id: string;
          palette_locked: boolean | null;
          project_name: string;
          psychological_concepts: Json | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          active_channels?: Json | null;
          active_formats?: Json | null;
          ai_enabled?: boolean | null;
          ai_fallback_provider?: string | null;
          ai_primary_provider?: string | null;
          ai_quality_rules?: Json | null;
          ai_system_prompt?: string | null;
          ai_tone?: string | null;
          created_at?: string | null;
          frequent_ctas?: Json | null;
          id?: string;
          palette_locked?: boolean | null;
          project_name?: string;
          psychological_concepts?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          active_channels?: Json | null;
          active_formats?: Json | null;
          ai_enabled?: boolean | null;
          ai_fallback_provider?: string | null;
          ai_primary_provider?: string | null;
          ai_quality_rules?: Json | null;
          ai_system_prompt?: string | null;
          ai_tone?: string | null;
          created_at?: string | null;
          frequent_ctas?: Json | null;
          id?: string;
          palette_locked?: boolean | null;
          project_name?: string;
          psychological_concepts?: Json | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      archive_items: {
        Row: {
          archive_reason: string;
          archived_at: string;
          created_at: string | null;
          id: string;
          name: string;
          notes: string | null;
          origin: string;
          recoverable: boolean | null;
          status: string;
          type: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          archive_reason: string;
          archived_at: string;
          created_at?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          origin: string;
          recoverable?: boolean | null;
          status: string;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          archive_reason?: string;
          archived_at?: string;
          created_at?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          origin?: string;
          recoverable?: boolean | null;
          status?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      audiencia: {
        Row: {
          created_at: string | null;
          crecimiento_mensual: number | null;
          fecha_actualizacion: string | null;
          id: number;
          proyecto_id: number;
          rango_etario_principal: string | null;
          total_seguidores: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          crecimiento_mensual?: number | null;
          fecha_actualizacion?: string | null;
          id?: number;
          proyecto_id: number;
          rango_etario_principal?: string | null;
          total_seguidores?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          crecimiento_mensual?: number | null;
          fecha_actualizacion?: string | null;
          id?: number;
          proyecto_id?: number;
          rango_etario_principal?: string | null;
          total_seguidores?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'audiencia_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'audiencia_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      automation_rules: {
        Row: {
          created_at: string | null;
          id: string;
          input: string;
          name: string;
          next_review: string | null;
          objective: string;
          output: string;
          responsible: string | null;
          risk: string | null;
          status: string;
          tool: string;
          trigger: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          input: string;
          name: string;
          next_review?: string | null;
          objective: string;
          output: string;
          responsible?: string | null;
          risk?: string | null;
          status?: string;
          tool: string;
          trigger: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          input?: string;
          name?: string;
          next_review?: string | null;
          objective?: string;
          output?: string;
          responsible?: string | null;
          risk?: string | null;
          status?: string;
          tool?: string;
          trigger?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          channel: string | null;
          content_id: string | null;
          created_at: string | null;
          date: string;
          episode_id: string | null;
          frequency: string | null;
          id: string;
          notes: string | null;
          status: string | null;
          time: string | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          channel?: string | null;
          content_id?: string | null;
          created_at?: string | null;
          date: string;
          episode_id?: string | null;
          frequency?: string | null;
          id?: string;
          notes?: string | null;
          status?: string | null;
          time?: string | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          channel?: string | null;
          content_id?: string | null;
          created_at?: string | null;
          date?: string;
          episode_id?: string | null;
          frequency?: string | null;
          id?: string;
          notes?: string | null;
          status?: string | null;
          time?: string | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'calendar_events_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'content_pieces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'calendar_events_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      checklist_produccion: {
        Row: {
          created_at: string | null;
          critico: boolean | null;
          id: number;
          item: string;
          operacion_id: number;
          orden: number | null;
        };
        Insert: {
          created_at?: string | null;
          critico?: boolean | null;
          id?: number;
          item: string;
          operacion_id: number;
          orden?: number | null;
        };
        Update: {
          created_at?: string | null;
          critico?: boolean | null;
          id?: number;
          item?: string;
          operacion_id?: number;
          orden?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'checklist_produccion_operacion_id_fkey';
            columns: ['operacion_id'];
            isOneToOne: false;
            referencedRelation: 'operacion';
            referencedColumns: ['id'];
          },
        ];
      };
      checklists: {
        Row: {
          area: string;
          created_at: string | null;
          errors_to_avoid: string | null;
          frequency: string | null;
          id: string;
          items: Json;
          name: string;
          ready_criteria: string | null;
          related_content_id: string | null;
          related_episode_id: string | null;
          status: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          area: string;
          created_at?: string | null;
          errors_to_avoid?: string | null;
          frequency?: string | null;
          id?: string;
          items?: Json;
          name: string;
          ready_criteria?: string | null;
          related_content_id?: string | null;
          related_episode_id?: string | null;
          status: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          area?: string;
          created_at?: string | null;
          errors_to_avoid?: string | null;
          frequency?: string | null;
          id?: string;
          items?: Json;
          name?: string;
          ready_criteria?: string | null;
          related_content_id?: string | null;
          related_episode_id?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'checklists_related_content_id_fkey';
            columns: ['related_content_id'];
            isOneToOne: false;
            referencedRelation: 'content_pieces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'checklists_related_episode_id_fkey';
            columns: ['related_episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      colores: {
        Row: {
          accesibilidad: string | null;
          codigo_hex: string;
          created_at: string | null;
          id: number;
          nombre: string;
          paleta_id: number;
          rgb_b: number;
          rgb_g: number;
          rgb_r: number;
          uso: string;
        };
        Insert: {
          accesibilidad?: string | null;
          codigo_hex: string;
          created_at?: string | null;
          id?: number;
          nombre: string;
          paleta_id: number;
          rgb_b: number;
          rgb_g: number;
          rgb_r: number;
          uso: string;
        };
        Update: {
          accesibilidad?: string | null;
          codigo_hex?: string;
          created_at?: string | null;
          id?: number;
          nombre?: string;
          paleta_id?: number;
          rgb_b?: number;
          rgb_g?: number;
          rgb_r?: number;
          uso?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'colores_paleta_id_fkey';
            columns: ['paleta_id'];
            isOneToOne: false;
            referencedRelation: 'paleta_colores';
            referencedColumns: ['id'];
          },
        ];
      };
      competencia: {
        Row: {
          created_at: string | null;
          id: number;
          mercado_tam: string | null;
          nicho_principal: string;
          proyecto_id: number;
          updated_at: string | null;
          ventaja_competitiva: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          mercado_tam?: string | null;
          nicho_principal: string;
          proyecto_id: number;
          updated_at?: string | null;
          ventaja_competitiva: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          mercado_tam?: string | null;
          nicho_principal?: string;
          proyecto_id?: number;
          updated_at?: string | null;
          ventaja_competitiva?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'competencia_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'competencia_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      content_pieces: {
        Row: {
          caption: string | null;
          channel: string;
          created_at: string | null;
          cta: string;
          emotion: string | null;
          episode_id: string | null;
          format: string;
          hook: string;
          id: string;
          main_text: string;
          metric_goal: string | null;
          objective: string | null;
          publish_date: string | null;
          status: string;
          theme: string;
          updated_at: string | null;
          user_id: string | null;
          visual_prompt: string | null;
        };
        Insert: {
          caption?: string | null;
          channel: string;
          created_at?: string | null;
          cta: string;
          emotion?: string | null;
          episode_id?: string | null;
          format: string;
          hook: string;
          id?: string;
          main_text: string;
          metric_goal?: string | null;
          objective?: string | null;
          publish_date?: string | null;
          status?: string;
          theme: string;
          updated_at?: string | null;
          user_id?: string | null;
          visual_prompt?: string | null;
        };
        Update: {
          caption?: string | null;
          channel?: string;
          created_at?: string | null;
          cta?: string;
          emotion?: string | null;
          episode_id?: string | null;
          format?: string;
          hook?: string;
          id?: string;
          main_text?: string;
          metric_goal?: string | null;
          objective?: string | null;
          publish_date?: string | null;
          status?: string;
          theme?: string;
          updated_at?: string | null;
          user_id?: string | null;
          visual_prompt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'content_pieces_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      decisiones: {
        Row: {
          created_at: string | null;
          id: number;
          proyecto_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          proyecto_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          proyecto_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'decisiones_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'decisiones_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      episodes: {
        Row: {
          apple_description: string | null;
          central_symbol: string;
          created_at: string | null;
          cta: string | null;
          emotional_wound: string;
          episode_number: string;
          hooks: Json | null;
          id: string;
          narrative_structure: Json | null;
          next_action: string | null;
          notes: string | null;
          objective: string | null;
          pillar: string | null;
          publish_date: string | null;
          script: string | null;
          spotify_description: string | null;
          status: string;
          theme: string;
          title: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          apple_description?: string | null;
          central_symbol: string;
          created_at?: string | null;
          cta?: string | null;
          emotional_wound: string;
          episode_number: string;
          hooks?: Json | null;
          id?: string;
          narrative_structure?: Json | null;
          next_action?: string | null;
          notes?: string | null;
          objective?: string | null;
          pillar?: string | null;
          publish_date?: string | null;
          script?: string | null;
          spotify_description?: string | null;
          status?: string;
          theme: string;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          apple_description?: string | null;
          central_symbol?: string;
          created_at?: string | null;
          cta?: string | null;
          emotional_wound?: string;
          episode_number?: string;
          hooks?: Json | null;
          id?: string;
          narrative_structure?: Json | null;
          next_action?: string | null;
          notes?: string | null;
          objective?: string | null;
          pillar?: string | null;
          publish_date?: string | null;
          script?: string | null;
          spotify_description?: string | null;
          status?: string;
          theme?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      episodios: {
        Row: {
          created_at: string | null;
          descripcion: string | null;
          duracion_minutos: number;
          fecha_publicacion: string;
          id: number;
          numero: number;
          proyecto_id: number;
          tema: string | null;
          titulo: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          descripcion?: string | null;
          duracion_minutos: number;
          fecha_publicacion: string;
          id?: number;
          numero: number;
          proyecto_id: number;
          tema?: string | null;
          titulo: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          descripcion?: string | null;
          duracion_minutos?: number;
          fecha_publicacion?: string;
          id?: number;
          numero?: number;
          proyecto_id?: number;
          tema?: string | null;
          titulo?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'episodios_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: false;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'episodios_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: false;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      flujo_produccion: {
        Row: {
          actividad: string;
          created_at: string | null;
          deliverables: string[] | null;
          dia: string;
          duracion_horas: number;
          herramientas: string[] | null;
          id: number;
          operacion_id: number;
          paso_numero: number;
        };
        Insert: {
          actividad: string;
          created_at?: string | null;
          deliverables?: string[] | null;
          dia: string;
          duracion_horas: number;
          herramientas?: string[] | null;
          id?: number;
          operacion_id: number;
          paso_numero: number;
        };
        Update: {
          actividad?: string;
          created_at?: string | null;
          deliverables?: string[] | null;
          dia?: string;
          duracion_horas?: number;
          herramientas?: string[] | null;
          id?: number;
          operacion_id?: number;
          paso_numero?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'flujo_produccion_operacion_id_fkey';
            columns: ['operacion_id'];
            isOneToOne: false;
            referencedRelation: 'operacion';
            referencedColumns: ['id'];
          },
        ];
      };
      flujos_ingreso: {
        Row: {
          acciones_necesarias: string[] | null;
          capacidad_maxima_semanal: number | null;
          created_at: string | null;
          descripcion: string;
          estado: Database['public']['Enums']['estado_flujo'];
          id: number;
          ingresos_estimados_mensual_mxn: number | null;
          ingresos_estimados_mensual_usd: number | null;
          monetizacion_id: number;
          precio_mxn: number | null;
          precio_usd: number | null;
          tipo: string;
          updated_at: string | null;
        };
        Insert: {
          acciones_necesarias?: string[] | null;
          capacidad_maxima_semanal?: number | null;
          created_at?: string | null;
          descripcion: string;
          estado: Database['public']['Enums']['estado_flujo'];
          id?: number;
          ingresos_estimados_mensual_mxn?: number | null;
          ingresos_estimados_mensual_usd?: number | null;
          monetizacion_id: number;
          precio_mxn?: number | null;
          precio_usd?: number | null;
          tipo: string;
          updated_at?: string | null;
        };
        Update: {
          acciones_necesarias?: string[] | null;
          capacidad_maxima_semanal?: number | null;
          created_at?: string | null;
          descripcion?: string;
          estado?: Database['public']['Enums']['estado_flujo'];
          id?: number;
          ingresos_estimados_mensual_mxn?: number | null;
          ingresos_estimados_mensual_usd?: number | null;
          monetizacion_id?: number;
          precio_mxn?: number | null;
          precio_usd?: number | null;
          tipo?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'flujos_ingreso_monetizacion_id_fkey';
            columns: ['monetizacion_id'];
            isOneToOne: false;
            referencedRelation: 'monetizacion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'flujos_ingreso_monetizacion_id_fkey';
            columns: ['monetizacion_id'];
            isOneToOne: false;
            referencedRelation: 'v_proyecciones_financieras';
            referencedColumns: ['id'];
          },
        ];
      };
      fundadores: {
        Row: {
          apodo: string | null;
          bio_oficial: string | null;
          created_at: string | null;
          id: number;
          motivacion_proyecto: string | null;
          nombre_completo: string;
          proyecto_id: number;
          rol_actual: string;
          ubicacion: string | null;
          updated_at: string | null;
          usuario_instagram: string | null;
        };
        Insert: {
          apodo?: string | null;
          bio_oficial?: string | null;
          created_at?: string | null;
          id?: number;
          motivacion_proyecto?: string | null;
          nombre_completo: string;
          proyecto_id: number;
          rol_actual?: string;
          ubicacion?: string | null;
          updated_at?: string | null;
          usuario_instagram?: string | null;
        };
        Update: {
          apodo?: string | null;
          bio_oficial?: string | null;
          created_at?: string | null;
          id?: number;
          motivacion_proyecto?: string | null;
          nombre_completo?: string;
          proyecto_id?: number;
          rol_actual?: string;
          ubicacion?: string | null;
          updated_at?: string | null;
          usuario_instagram?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fundadores_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fundadores_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      geografia: {
        Row: {
          audiencia_id: number;
          ciudades_principales: string[] | null;
          created_at: string | null;
          id: number;
          pais: string;
          porcentaje: number;
        };
        Insert: {
          audiencia_id: number;
          ciudades_principales?: string[] | null;
          created_at?: string | null;
          id?: number;
          pais: string;
          porcentaje: number;
        };
        Update: {
          audiencia_id?: number;
          ciudades_principales?: string[] | null;
          created_at?: string | null;
          id?: number;
          pais?: string;
          porcentaje?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'geografia_audiencia_id_fkey';
            columns: ['audiencia_id'];
            isOneToOne: false;
            referencedRelation: 'audiencia';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'geografia_audiencia_id_fkey';
            columns: ['audiencia_id'];
            isOneToOne: false;
            referencedRelation: 'v_metricas_audiencia';
            referencedColumns: ['id'];
          },
        ];
      };
      herramientas: {
        Row: {
          categoria: string;
          created_at: string | null;
          descripcion: string | null;
          id: number;
          nombre: string;
          operacion_id: number;
        };
        Insert: {
          categoria: string;
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre: string;
          operacion_id: number;
        };
        Update: {
          categoria?: string;
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre?: string;
          operacion_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'herramientas_operacion_id_fkey';
            columns: ['operacion_id'];
            isOneToOne: false;
            referencedRelation: 'operacion';
            referencedColumns: ['id'];
          },
        ];
      };
      ideas: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      identidad: {
        Row: {
          anti_referente: string | null;
          created_at: string | null;
          declaracion_fundacional: string;
          id: number;
          mision: string;
          proposito: string;
          proyecto_id: number;
          updated_at: string | null;
          vision: string;
        };
        Insert: {
          anti_referente?: string | null;
          created_at?: string | null;
          declaracion_fundacional: string;
          id?: number;
          mision: string;
          proposito: string;
          proyecto_id: number;
          updated_at?: string | null;
          vision: string;
        };
        Update: {
          anti_referente?: string | null;
          created_at?: string | null;
          declaracion_fundacional?: string;
          id?: number;
          mision?: string;
          proposito?: string;
          proyecto_id?: number;
          updated_at?: string | null;
          vision?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'identidad_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'identidad_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      items_decisiones: {
        Row: {
          contenido: string;
          created_at: string | null;
          decisiones_id: number;
          id: number;
          metadata: Json | null;
          orden: number | null;
          tipo: string;
        };
        Insert: {
          contenido: string;
          created_at?: string | null;
          decisiones_id: number;
          id?: number;
          metadata?: Json | null;
          orden?: number | null;
          tipo: string;
        };
        Update: {
          contenido?: string;
          created_at?: string | null;
          decisiones_id?: number;
          id?: number;
          metadata?: Json | null;
          orden?: number | null;
          tipo?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'items_decisiones_decisiones_id_fkey';
            columns: ['decisiones_id'];
            isOneToOne: false;
            referencedRelation: 'decisiones';
            referencedColumns: ['id'];
          },
        ];
      };
      master_sections: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          last_reviewed_at: string | null;
          notes: string | null;
          priority: string;
          responsible: string | null;
          status: string;
          title: string;
          updated_at: string | null;
          user_id: string | null;
          version: number | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          notes?: string | null;
          priority?: string;
          responsible?: string | null;
          status?: string;
          title: string;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          last_reviewed_at?: string | null;
          notes?: string | null;
          priority?: string;
          responsible?: string | null;
          status?: string;
          title?: string;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
        };
        Relationships: [];
      };
      metricas_demographics: {
        Row: {
          audiencia_id: number;
          categoria: string;
          created_at: string | null;
          id: number;
          porcentaje: number;
          tipo: Database['public']['Enums']['tipo_demografica'];
        };
        Insert: {
          audiencia_id: number;
          categoria: string;
          created_at?: string | null;
          id?: number;
          porcentaje: number;
          tipo: Database['public']['Enums']['tipo_demografica'];
        };
        Update: {
          audiencia_id?: number;
          categoria?: string;
          created_at?: string | null;
          id?: number;
          porcentaje?: number;
          tipo?: Database['public']['Enums']['tipo_demografica'];
        };
        Relationships: [
          {
            foreignKeyName: 'metricas_demographics_audiencia_id_fkey';
            columns: ['audiencia_id'];
            isOneToOne: false;
            referencedRelation: 'audiencia';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'metricas_demographics_audiencia_id_fkey';
            columns: ['audiencia_id'];
            isOneToOne: false;
            referencedRelation: 'v_metricas_audiencia';
            referencedColumns: ['id'];
          },
        ];
      };
      metrics_episode: {
        Row: {
          comments: number | null;
          conversions: number | null;
          created_at: string | null;
          dms: number | null;
          episode_id: string | null;
          id: string;
          insight: string | null;
          plays_48h: number | null;
          plays_7d: number | null;
          retention: number | null;
          saves: number | null;
          shares: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          comments?: number | null;
          conversions?: number | null;
          created_at?: string | null;
          dms?: number | null;
          episode_id?: string | null;
          id?: string;
          insight?: string | null;
          plays_48h?: number | null;
          plays_7d?: number | null;
          retention?: number | null;
          saves?: number | null;
          shares?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          comments?: number | null;
          conversions?: number | null;
          created_at?: string | null;
          dms?: number | null;
          episode_id?: string | null;
          id?: string;
          insight?: string | null;
          plays_48h?: number | null;
          plays_7d?: number | null;
          retention?: number | null;
          saves?: number | null;
          shares?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'metrics_episode_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      metrics_monthly: {
        Row: {
          action: string | null;
          conversions: number | null;
          created_at: string | null;
          dms: number | null;
          downloads: number | null;
          engagement: number | null;
          id: string;
          insight: string | null;
          link_clicks: number | null;
          month: string;
          platform: string;
          plays: number | null;
          profile_visits: number | null;
          reach: number | null;
          revenue: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          conversions?: number | null;
          created_at?: string | null;
          dms?: number | null;
          downloads?: number | null;
          engagement?: number | null;
          id?: string;
          insight?: string | null;
          link_clicks?: number | null;
          month: string;
          platform: string;
          plays?: number | null;
          profile_visits?: number | null;
          reach?: number | null;
          revenue?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          conversions?: number | null;
          created_at?: string | null;
          dms?: number | null;
          downloads?: number | null;
          engagement?: number | null;
          id?: string;
          insight?: string | null;
          link_clicks?: number | null;
          month?: string;
          platform?: string;
          plays?: number | null;
          profile_visits?: number | null;
          reach?: number | null;
          revenue?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      metrics_notes: {
        Row: {
          created_at: string;
          id: string;
          item_key: string;
          kind: string;
          month_key: string | null;
          payload: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_key: string;
          kind: string;
          month_key?: string | null;
          payload?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_key?: string;
          kind?: string;
          month_key?: string | null;
          payload?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      monetizacion: {
        Row: {
          created_at: string | null;
          id: number;
          proyecto_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          proyecto_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          proyecto_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'monetizacion_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'monetizacion_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      monetization_leads: {
        Row: {
          close_probability: number | null;
          contact: string;
          content_id: string | null;
          conversion_origin: string | null;
          created_at: string | null;
          episode_id: string | null;
          follow_up_date: string | null;
          id: string;
          name: string;
          next_action: string;
          notes: string | null;
          offer: string;
          potential_value: number | null;
          real_revenue: number | null;
          source: string;
          status: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          close_probability?: number | null;
          contact: string;
          content_id?: string | null;
          conversion_origin?: string | null;
          created_at?: string | null;
          episode_id?: string | null;
          follow_up_date?: string | null;
          id?: string;
          name: string;
          next_action: string;
          notes?: string | null;
          offer: string;
          potential_value?: number | null;
          real_revenue?: number | null;
          source: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          close_probability?: number | null;
          contact?: string;
          content_id?: string | null;
          conversion_origin?: string | null;
          created_at?: string | null;
          episode_id?: string | null;
          follow_up_date?: string | null;
          id?: string;
          name?: string;
          next_action?: string;
          notes?: string | null;
          offer?: string;
          potential_value?: number | null;
          real_revenue?: number | null;
          source?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'monetization_leads_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'content_pieces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'monetization_leads_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      notes: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      operacion: {
        Row: {
          carga_horaria_semanal: number;
          created_at: string | null;
          id: number;
          proyecto_id: number;
          updated_at: string | null;
        };
        Insert: {
          carga_horaria_semanal: number;
          created_at?: string | null;
          id?: number;
          proyecto_id: number;
          updated_at?: string | null;
        };
        Update: {
          carga_horaria_semanal?: number;
          created_at?: string | null;
          id?: number;
          proyecto_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'operacion_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'operacion_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      paleta_colores: {
        Row: {
          created_at: string | null;
          id: number;
          nombre_paleta: string;
          proyecto_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          nombre_paleta: string;
          proyecto_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          nombre_paleta?: string;
          proyecto_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'paleta_colores_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'paleta_colores_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      plataformas: {
        Row: {
          created_at: string | null;
          estado: Database['public']['Enums']['estado_flujo'] | null;
          id: number;
          nombre: string;
          prioridad: Database['public']['Enums']['prioridad_plataforma'] | null;
          proyecto_id: number;
          updated_at: string | null;
          url: string | null;
        };
        Insert: {
          created_at?: string | null;
          estado?: Database['public']['Enums']['estado_flujo'] | null;
          id?: number;
          nombre: string;
          prioridad?: Database['public']['Enums']['prioridad_plataforma'] | null;
          proyecto_id: number;
          updated_at?: string | null;
          url?: string | null;
        };
        Update: {
          created_at?: string | null;
          estado?: Database['public']['Enums']['estado_flujo'] | null;
          id?: number;
          nombre?: string;
          prioridad?: Database['public']['Enums']['prioridad_plataforma'] | null;
          proyecto_id?: number;
          updated_at?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'plataformas_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: false;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plataformas_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: false;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      podcast_strategy_snapshots: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      proyectos: {
        Row: {
          categoria: string;
          created_at: string | null;
          descripcion: string;
          estado: Database['public']['Enums']['estado_proyecto'] | null;
          fecha_lanzamiento: string;
          formato: string;
          id: number;
          idioma: string | null;
          nombre_corto: string;
          nombre_oficial: string;
          temporadas_total: number | null;
          updated_at: string | null;
        };
        Insert: {
          categoria: string;
          created_at?: string | null;
          descripcion: string;
          estado?: Database['public']['Enums']['estado_proyecto'] | null;
          fecha_lanzamiento: string;
          formato: string;
          id?: number;
          idioma?: string | null;
          nombre_corto: string;
          nombre_oficial: string;
          temporadas_total?: number | null;
          updated_at?: string | null;
        };
        Update: {
          categoria?: string;
          created_at?: string | null;
          descripcion?: string;
          estado?: Database['public']['Enums']['estado_proyecto'] | null;
          fecha_lanzamiento?: string;
          formato?: string;
          id?: number;
          idioma?: string | null;
          nombre_corto?: string;
          nombre_oficial?: string;
          temporadas_total?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      puntos_clave_episodio: {
        Row: {
          contenido: string;
          created_at: string | null;
          episodio_id: number;
          id: number;
          orden: number;
        };
        Insert: {
          contenido: string;
          created_at?: string | null;
          episodio_id: number;
          id?: number;
          orden: number;
        };
        Update: {
          contenido?: string;
          created_at?: string | null;
          episodio_id?: number;
          id?: number;
          orden?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'puntos_clave_episodio_episodio_id_fkey';
            columns: ['episodio_id'];
            isOneToOne: false;
            referencedRelation: 'episodios';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'puntos_clave_episodio_episodio_id_fkey';
            columns: ['episodio_id'];
            isOneToOne: false;
            referencedRelation: 'v_catalogo_episodios';
            referencedColumns: ['id'];
          },
        ];
      };
      referentes: {
        Row: {
          audiencia_target: string | null;
          autoridad: string | null;
          competencia_id: number;
          created_at: string | null;
          debilidades: string[] | null;
          diferenciales_amtme: string[] | null;
          duracion_minutos: number | null;
          formato: string | null;
          fortalezas: string[] | null;
          id: number;
          nombre: string;
        };
        Insert: {
          audiencia_target?: string | null;
          autoridad?: string | null;
          competencia_id: number;
          created_at?: string | null;
          debilidades?: string[] | null;
          diferenciales_amtme?: string[] | null;
          duracion_minutos?: number | null;
          formato?: string | null;
          fortalezas?: string[] | null;
          id?: number;
          nombre: string;
        };
        Update: {
          audiencia_target?: string | null;
          autoridad?: string | null;
          competencia_id?: number;
          created_at?: string | null;
          debilidades?: string[] | null;
          diferenciales_amtme?: string[] | null;
          duracion_minutos?: number | null;
          formato?: string | null;
          fortalezas?: string[] | null;
          id?: number;
          nombre?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'referentes_competencia_id_fkey';
            columns: ['competencia_id'];
            isOneToOne: false;
            referencedRelation: 'competencia';
            referencedColumns: ['id'];
          },
        ];
      };
      reticulas: {
        Row: {
          created_at: string | null;
          especificaciones_tecnicas: Json | null;
          formato_tipo: string;
          id: number;
          lienzo: string;
          margen_exterior: number | null;
          sistema_visual_id: number;
        };
        Insert: {
          created_at?: string | null;
          especificaciones_tecnicas?: Json | null;
          formato_tipo: string;
          id?: number;
          lienzo: string;
          margen_exterior?: number | null;
          sistema_visual_id: number;
        };
        Update: {
          created_at?: string | null;
          especificaciones_tecnicas?: Json | null;
          formato_tipo?: string;
          id?: number;
          lienzo?: string;
          margen_exterior?: number | null;
          sistema_visual_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'reticulas_sistema_visual_id_fkey';
            columns: ['sistema_visual_id'];
            isOneToOne: false;
            referencedRelation: 'sistema_visual';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'reticulas_sistema_visual_id_fkey';
            columns: ['sistema_visual_id'];
            isOneToOne: false;
            referencedRelation: 'v_especificaciones_visuales';
            referencedColumns: ['id'];
          },
        ];
      };
      roadmap_monetizacion: {
        Row: {
          acciones: string[] | null;
          created_at: string | null;
          id: number;
          mes: number;
          monetizacion_id: number;
          proyeccion_ingresos_usd: number | null;
        };
        Insert: {
          acciones?: string[] | null;
          created_at?: string | null;
          id?: number;
          mes: number;
          monetizacion_id: number;
          proyeccion_ingresos_usd?: number | null;
        };
        Update: {
          acciones?: string[] | null;
          created_at?: string | null;
          id?: number;
          mes?: number;
          monetizacion_id?: number;
          proyeccion_ingresos_usd?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'roadmap_monetizacion_monetizacion_id_fkey';
            columns: ['monetizacion_id'];
            isOneToOne: false;
            referencedRelation: 'monetizacion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'roadmap_monetizacion_monetizacion_id_fkey';
            columns: ['monetizacion_id'];
            isOneToOne: false;
            referencedRelation: 'v_proyecciones_financieras';
            referencedColumns: ['id'];
          },
        ];
      };
      scripts: {
        Row: {
          action: string | null;
          bridge: string | null;
          closing: string | null;
          created_at: string | null;
          cta: string | null;
          episode_id: string | null;
          id: string;
          opening: string | null;
          status: string;
          symbol: string | null;
          threshold: string | null;
          title: string;
          truth: string | null;
          updated_at: string | null;
          user_id: string | null;
          version: number | null;
          voice_notes: string | null;
          wound: string | null;
        };
        Insert: {
          action?: string | null;
          bridge?: string | null;
          closing?: string | null;
          created_at?: string | null;
          cta?: string | null;
          episode_id?: string | null;
          id?: string;
          opening?: string | null;
          status?: string;
          symbol?: string | null;
          threshold?: string | null;
          title: string;
          truth?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
          voice_notes?: string | null;
          wound?: string | null;
        };
        Update: {
          action?: string | null;
          bridge?: string | null;
          closing?: string | null;
          created_at?: string | null;
          cta?: string | null;
          episode_id?: string | null;
          id?: string;
          opening?: string | null;
          status?: string;
          symbol?: string | null;
          threshold?: string | null;
          title?: string;
          truth?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          version?: number | null;
          voice_notes?: string | null;
          wound?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'scripts_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
      sistema_visual: {
        Row: {
          created_at: string | null;
          descripcion: string | null;
          id: number;
          nombre: string;
          piezas_totales: number | null;
          proyecto_id: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre: string;
          piezas_totales?: number | null;
          proyecto_id: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          descripcion?: string | null;
          id?: number;
          nombre?: string;
          piezas_totales?: number | null;
          proyecto_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'sistema_visual_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'proyectos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'sistema_visual_proyecto_id_fkey';
            columns: ['proyecto_id'];
            isOneToOne: true;
            referencedRelation: 'v_resumen_proyecto';
            referencedColumns: ['id'];
          },
        ];
      };
      spotify_episode_metrics: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      spotify_metric_imports: {
        Row: {
          created_at: string;
          id: string;
          payload: Json;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      studio_state: {
        Row: {
          created_at: string;
          id: string;
          key: string;
          payload: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          key: string;
          payload?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          key?: string;
          payload?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tipos_piezas_visuales: {
        Row: {
          cantidad: number;
          created_at: string | null;
          descripcion: string | null;
          formato: string;
          id: number;
          sistema_visual_id: number;
          tipo: Database['public']['Enums']['tipo_pieza_visual'];
        };
        Insert: {
          cantidad: number;
          created_at?: string | null;
          descripcion?: string | null;
          formato: string;
          id?: number;
          sistema_visual_id: number;
          tipo: Database['public']['Enums']['tipo_pieza_visual'];
        };
        Update: {
          cantidad?: number;
          created_at?: string | null;
          descripcion?: string | null;
          formato?: string;
          id?: number;
          sistema_visual_id?: number;
          tipo?: Database['public']['Enums']['tipo_pieza_visual'];
        };
        Relationships: [
          {
            foreignKeyName: 'tipos_piezas_visuales_sistema_visual_id_fkey';
            columns: ['sistema_visual_id'];
            isOneToOne: false;
            referencedRelation: 'sistema_visual';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tipos_piezas_visuales_sistema_visual_id_fkey';
            columns: ['sistema_visual_id'];
            isOneToOne: false;
            referencedRelation: 'v_especificaciones_visuales';
            referencedColumns: ['id'];
          },
        ];
      };
      valores: {
        Row: {
          aplicacion: string | null;
          created_at: string | null;
          id: number;
          identidad_id: number;
          nombre: string;
          orden: number;
          significado: string;
        };
        Insert: {
          aplicacion?: string | null;
          created_at?: string | null;
          id?: number;
          identidad_id: number;
          nombre: string;
          orden: number;
          significado: string;
        };
        Update: {
          aplicacion?: string | null;
          created_at?: string | null;
          id?: number;
          identidad_id?: number;
          nombre?: string;
          orden?: number;
          significado?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'valores_identidad_id_fkey';
            columns: ['identidad_id'];
            isOneToOne: false;
            referencedRelation: 'identidad';
            referencedColumns: ['id'];
          },
        ];
      };
      visual_assets: {
        Row: {
          content_id: string | null;
          created_at: string | null;
          cta: string | null;
          episode_id: string | null;
          format: string;
          id: string;
          main_text: string | null;
          palette: string;
          prompt: string;
          secondary_text: string | null;
          status: string;
          technical_spec: string | null;
          template_variables: Json | null;
          title: string;
          type: string;
          updated_at: string | null;
          user_id: string | null;
          visual_reference: string | null;
        };
        Insert: {
          content_id?: string | null;
          created_at?: string | null;
          cta?: string | null;
          episode_id?: string | null;
          format: string;
          id?: string;
          main_text?: string | null;
          palette: string;
          prompt: string;
          secondary_text?: string | null;
          status: string;
          technical_spec?: string | null;
          template_variables?: Json | null;
          title: string;
          type: string;
          updated_at?: string | null;
          user_id?: string | null;
          visual_reference?: string | null;
        };
        Update: {
          content_id?: string | null;
          created_at?: string | null;
          cta?: string | null;
          episode_id?: string | null;
          format?: string;
          id?: string;
          main_text?: string | null;
          palette?: string;
          prompt?: string;
          secondary_text?: string | null;
          status?: string;
          technical_spec?: string | null;
          template_variables?: Json | null;
          title?: string;
          type?: string;
          updated_at?: string | null;
          user_id?: string | null;
          visual_reference?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'visual_assets_content_id_fkey';
            columns: ['content_id'];
            isOneToOne: false;
            referencedRelation: 'content_pieces';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'visual_assets_episode_id_fkey';
            columns: ['episode_id'];
            isOneToOne: false;
            referencedRelation: 'episodes';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      v_catalogo_episodios: {
        Row: {
          duracion_minutos: number | null;
          fecha_publicacion: string | null;
          id: number | null;
          numero: number | null;
          tema: string | null;
          titulo: string | null;
          total_puntos_clave: number | null;
        };
        Relationships: [];
      };
      v_especificaciones_visuales: {
        Row: {
          colores_paleta: number | null;
          id: number | null;
          nombre: string | null;
          piezas_totales: number | null;
          tipos_piezas: number | null;
        };
        Relationships: [];
      };
      v_metricas_audiencia: {
        Row: {
          dimensiones_edad: number | null;
          dimensiones_genero: number | null;
          id: number | null;
          paises_representados: number | null;
        };
        Insert: {
          dimensiones_edad?: never;
          dimensiones_genero?: never;
          id?: number | null;
          paises_representados?: never;
        };
        Update: {
          dimensiones_edad?: never;
          dimensiones_genero?: never;
          id?: number | null;
          paises_representados?: never;
        };
        Relationships: [];
      };
      v_proyecciones_financieras: {
        Row: {
          flujos_activos: number | null;
          id: number | null;
          ingresos_actuales_usd: number | null;
          proyeccion_total_6meses: number | null;
        };
        Relationships: [];
      };
      v_resumen_proyecto: {
        Row: {
          audiencia_principal: string | null;
          estado: Database['public']['Enums']['estado_proyecto'] | null;
          fecha_lanzamiento: string | null;
          fundador: string | null;
          id: number | null;
          nombre_corto: string | null;
          nombre_oficial: string | null;
          seguidores: number | null;
          total_episodios: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      proximos_episodios: {
        Args: { p_cantidad?: number; p_proyecto_id: number };
        Returns: {
          duracion_minutos: number;
          fecha: string;
          numero: number;
          titulo: string;
        }[];
      };
      tasa_crecimiento_audience: {
        Args: { p_audiencia_id: number };
        Returns: number;
      };
    };
    Enums: {
      estado_flujo: 'activo' | 'pendiente' | 'planeado';
      estado_proyecto: 'activo' | 'pausado' | 'archivado';
      prioridad_plataforma: 'principal' | 'secundaria' | 'terciaria';
      tipo_demografica: 'genero' | 'rango_etario';
      tipo_pieza_visual: 'feed' | 'story' | 'cuadrado' | 'carrusel' | 'banner' | 'destacado';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      estado_flujo: ['activo', 'pendiente', 'planeado'],
      estado_proyecto: ['activo', 'pausado', 'archivado'],
      prioridad_plataforma: ['principal', 'secundaria', 'terciaria'],
      tipo_demografica: ['genero', 'rango_etario'],
      tipo_pieza_visual: ['feed', 'story', 'cuadrado', 'carrusel', 'banner', 'destacado'],
    },
  },
} as const;
