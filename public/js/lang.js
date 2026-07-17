const LANG_STORAGE_KEY = 'evote_lang';

const translations = {
  en: {
    // Admin
    elections: 'Elections',
    booths: 'Booths',
    new_election: '+ New Election',
    mock_election: 'Mock Election',
    edit: 'Edit',
    activate: 'Activate',
    close: 'Close',
    delete: 'Delete',
    positions: 'Positions',
    otps: 'OTPs',
    cancel: 'Cancel',
    create: 'Create',
    save: 'Save',
    done: 'Done',
    title: 'Title',
    description: 'Description',
    sort_order: 'Sort Order',
    name: 'Name',
    party: 'Class',
    photo: 'Photo',
    symbol: 'Symbol',
    count: 'Count:',
    booth_code: '6-Letter Code',
    booth_name: 'Booth Name',
    generate: 'Generate',
    print_a4_slips: 'Print A4 Slips',
    photos: 'Photos',
    symbols: 'Symbols',
    crop_save: 'Crop & Save',
    upload_symbol: 'Upload Symbol',
    crop_upload: 'Crop & Upload',
    choose_image: 'Choose Image',
    use_existing: 'Use existing image',
    create_booth: 'Create Booth',
    new_election_title: 'New Election',
    edit_election: 'Edit Election',
    new_position: 'New Position',
    new_candidate: 'New Candidate',
    no_elections: 'No elections yet. Create your first election to get started.',
    no_candidates: 'No candidates yet',
    no_booths: 'No booths created yet.',
    e_title_placeholder: 'e.g., Student Council Election 2024',
    e_desc_placeholder: 'Optional description',
    p_title_placeholder: 'e.g., President',
    p_desc_placeholder: 'e.g., Head of Student Council',
    c_name_placeholder: 'Candidate name',
    c_party_placeholder: 'e.g., 10th Standard',
    c_photo_placeholder: 'URL or use crop tool below',
    b_code_placeholder: 'e.g., BOOTH1',
    b_name_placeholder: 'e.g., Main Hall',
    otp_generate_desc: 'Generate 6-digit numeric OTPs. Each OTP allows one voter to cast their vote. Print the slips and have polling officers fill in voter details.',
    otp_summary: 'OTP Summary',
    total: 'Total',
    unused: 'Unused',
    used: 'Used',
    unused_otps: 'Unused OTPs',
    all_otps: 'All OTPs',
    back: 'Back',
    print: 'Print',
    results: 'Results',
    positions_candidates: 'Positions & Candidates',
    add_candidate: '+Candidate',
    add_position: '+ Add Position',
    voter_url: 'Voter URL',
    pro_url: 'Pro URL',
    action: 'Action',
    pending: 'Pending',
    approved: 'Approved',
    status: 'Status',
    confirm_activate: 'Activate this election? Voters will be able to vote.',
    confirm_close: 'Close this election? No more votes will be accepted.',
    confirm_delete: 'Delete this election permanently?',
    confirm_mock: 'Generate a mock election with sample positions and candidates?',
    confirm_reset_votes: 'All polled votes will be cleared and OTPs reset. This cannot be undone.',
    reset_votes: 'Reset Votes',
    confirm_reset_votes: 'Clear all polled votes and reset OTPs? This cannot be undone.',
    confirm_delete_candidate: 'Delete this candidate?',
    confirm_delete_booth: 'Delete this booth?',
    confirm_unbind: 'Remove this IP binding?',
    confirm_reject_device: 'Reject this device?',
    title_required: 'Title required',
    name_required: 'Name required',
    enter_6letter_code: 'Enter a 6-letter code',
    code_6chars: 'Code must be exactly 6 characters',
    enter_booth_name: 'Enter a booth name',
    booth_create_desc: 'Enter a booth name and a unique 6-character code will be generated automatically.',
    no_unused_otps: 'No unused OTPs to print',
    create_booth_success: 'Booth created with code: ',

    // Voter
    ready: 'READY',
    voted: 'VOTED',
    done_label: 'DONE',
    vote: 'VOTE',
    confirm_vote: 'Confirm Your Vote',
    cancel_vote: 'Cancel',
    confirm_vote_btn: 'Confirm Vote',
    thank_you: 'Thank You!',
    vote_recorded: 'Your vote has been recorded successfully.',
    close_window: 'You may close this window.',
    for_: 'for',
    initializing: 'Initializing...',
    select_candidate_prompt: 'Select your candidate and press the blue VOTE button',
    select_for: 'Select a candidate for ',
    no_active_election: 'No active election. Please wait for admin to start one.',
    enter_token: 'Enter your booth token to start voting',
    token_placeholder: 'Paste booth token here',
    start_voting: 'Start Voting',
    position_of: 'Position',
    of: 'of',
    please_select: 'Please select a candidate first',
    casting_vote: 'Casting your vote...',
    vote_recorded_for: 'Vote recorded for',
    e_vote_title: '🗳️ E-Vote',
    booth_name_label: '🗳️ e-Vote',
    next_voter_ready: 'Next voter ready in a moment...',
    ready_label: 'READY',
    ip_bindings: 'IP Bindings',
    binding_desc: 'IP addresses bound to booth codes. Delete a binding to force a device to re-enter its booth code.',
    no_bindings: 'No active bindings.',
    unbind: 'Unbind',
    ip_address: 'IP Address',
    binding_type: 'Type',
    binding_created: 'Created',

    // Pro
    pro_login: 'Pro Booth Login',
    pro_desc: 'Enter the token provided by the admin to access voting progress.',
    booth_token: 'Booth Token',
    token_placeholder_pro: 'Paste your booth token',
    connect: 'Connect',
    select_election: 'Select Election',
    live_results: 'Live Results',
    no_positions: 'No positions defined.',
    no_elections_found: 'No elections found. Ask admin to create one.',
    votes_cast: 'Votes Cast',
    total_voters: 'Total Voters',
    turnout: 'Turnout',
    not_connected: 'Not Connected',
    connected: 'Connected',
    waiting_votes: 'Waiting for votes...',
    no_voters: 'No voters registered yet',
    of_voters: 'of',
    voters_percent: 'voters',
    preside_off: '🗳️ Presiding Officer',
    evm_status: 'EVM Status',
    no_evms_connected: 'No EVMs connected yet. Open voter pages to register.',
    evms: 'EVMs',
    pending_evms_desc: 'EVMs waiting for admin approval. Approve or reject each device.',
    no_pending_evms: 'No pending EVM approvals.',
    approve: 'Approve',
    reject: 'Reject',
    new_binding: 'New IP Binding',
    awaiting_approval: 'Awaiting Approval',
    evm_pending_desc: 'This EVM is waiting for admin approval. Please wait...',
    booth_pending_desc: 'This booth device is waiting for admin approval. Please wait...',
    booth_devices: 'Booth Devices',
    pending_booth_desc: 'Booth devices (Pro interfaces) waiting for admin approval.',
    no_pending_booth_devices: 'No pending booth device approvals.',
    device: 'Device',
    admin_panel: 'Admin Panel',
    mock_link: 'Try Mock Voting',
    landing_title: 'e-Vote',
    landing_subtitle: 'Student Council Election Platform',
    register_as_evm: 'Register as EVM',
    register_as_evm_desc: 'Use this device as a voting machine for voters to cast their ballots',
    register_as_booth: 'Register as Booth',
    register_as_booth_desc: 'Monitor EVM status, turnout, and voting progress in real-time',
    alignment: 'Alignment',
    crop_preview: 'Crop preview',
    settings: 'Print Settings',
    settings_desc: 'Configure school name and logo that appear on all printed documents (candidate lists, OTP slips, results).',
    school_name: 'School Name',
    school_logo_url: 'School Logo URL',
    logo_hint: 'Upload a logo image using the crop tool and paste the URL here, or use any public image URL.',
    settings_saved: 'Settings saved successfully.',
    browse: 'Browse',
    serial: 'Serial No.',
    serial_placeholder: 'e.g., 1',
  },

  kn: {
    // Admin
    elections: 'ಚುನಾವಣೆಗಳು',
    booths: 'ಮತಗಟ್ಟೆಗಳು',
    new_election: '+ ಹೊಸ ಚುನಾವಣೆ',
    mock_election: 'ಮಾಕ್ ಚುನಾವಣೆ',
    edit: 'ಸಂಪಾದಿಸಿ',
    activate: 'ಸಕ್ರಿಯಗೊಳಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    delete: 'ಅಳಿಸಿ',
    positions: 'ಸ್ಥಾನಗಳು',
    otps: 'OTPಗಳು',
    cancel: 'ರದ್ದುಮಾಡಿ',
    create: 'ರಚಿಸಿ',
    save: 'ಉಳಿಸಿ',
    done: 'ಮುಗಿದಿದೆ',
    title: 'ಶೀರ್ಷಿಕೆ',
    description: 'ವಿವರಣೆ',
    sort_order: 'ಕ್ರಮ ಸಂಖ್ಯೆ',
    name: 'ಹೆಸರು',
    party: 'ತರಗತಿ',
    photo: 'ಫೋಟೋ',
    symbol: 'ಚಿಹ್ನೆ',
    count: 'ಎಣಿಕೆ:',
    booth_code: '6-ಅಕ್ಷರದ ಕೋಡ್',
    booth_name: 'ಮತಗಟ್ಟೆ ಹೆಸರು',
    generate: 'ರಚಿಸಿ',
    print_a4_slips: 'A4 ಸ್ಲಿಪ್ ಮುದ್ರಿಸಿ',
    photos: 'ಫೋಟೋಗಳು',
    symbols: 'ಚಿಹ್ನೆಗಳು',
    crop_save: 'ಕ್ರಾಪ್ ಮತ್ತು ಉಳಿಸಿ',
    upload_symbol: 'ಚಿಹ್ನೆ ಅಪ್ಲೋಡ್',
    crop_upload: 'ಕ್ರಾಪ್ ಮತ್ತು ಅಪ್ಲೋಡ್',
    choose_image: 'ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ',
    use_existing: 'ಅಸ್ತಿತ್ವದ ಚಿತ್ರ ಬಳಸಿ',
    create_booth: 'ಮತಗಟ್ಟೆ ರಚಿಸಿ',
    new_election_title: 'ಹೊಸ ಚುನಾವಣೆ',
    edit_election: 'ಚುನಾವಣೆ ಸಂಪಾದಿಸಿ',
    new_position: 'ಹೊಸ ಸ್ಥಾನ',
    new_candidate: 'ಹೊಸ ಅಭ್ಯರ್ಥಿ',
    no_elections: 'ಇನ್ನೂ ಚುನಾವಣೆಗಳಿಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು ಮೊದಲ ಚುನಾವಣೆಯನ್ನು ರಚಿಸಿ.',
    no_candidates: 'ಇನ್ನೂ ಅಭ್ಯರ್ಥಿಗಳಿಲ್ಲ',
    no_booths: 'ಇನ್ನೂ ಮತಗಟ್ಟೆಗಳನ್ನು ರಚಿಸಲಾಗಿಲ್ಲ.',
    e_title_placeholder: 'ಉದಾ: ವಿದ್ಯಾರ್ಥಿ ಸಂಘ ಚುನಾವಣೆ 2024',
    e_desc_placeholder: 'ಐಚ್ಛಿಕ ವಿವರಣೆ',
    p_title_placeholder: 'ಉದಾ: ಅಧ್ಯಕ್ಷ',
    p_desc_placeholder: 'ಉದಾ: ವಿದ್ಯಾರ್ಥಿ ಸಂಘದ ಮುಖ್ಯಸ್ಥ',
    c_name_placeholder: 'ಅಭ್ಯರ್ಥಿಯ ಹೆಸರು',
    c_party_placeholder: 'ಉದಾ: 10ನೇ ತರಗತಿ',
    c_photo_placeholder: 'URL ಅಥವಾ ಕೆಳಗೆ ಕ್ರಾಪ್ ಉಪಕರಣ ಬಳಸಿ',
    b_code_placeholder: 'ಉದಾ: BOOTH1',
    b_name_placeholder: 'ಉದಾ: ಮುಖ್ಯ ಸಭಾಂಗಣ',
    otp_generate_desc: '6-ಅಂಕೆಯ ಸಂಖ್ಯಾ OTPಗಳನ್ನು ರಚಿಸಿ. ಪ್ರತಿ OTP ಒಬ್ಬ ಮತದಾರನಿಗೆ ಮತ ಚಲಾಯಿಸಲು ಅನುಮತಿಸುತ್ತದೆ. ಸ್ಲಿಪ್ಗಳನ್ನು ಮುದ್ರಿಸಿ ಮತ್ತು ಮತದಾರರ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಲು ಅಧಿಕಾರಿಗಳಿಗೆ ನೀಡಿ.',
    otp_summary: 'OTP ಸಾರಾಂಶ',
    total: 'ಒಟ್ಟು',
    unused: 'ಬಳಕೆಯಾಗಿಲ್ಲ',
    used: 'ಬಳಸಲಾಗಿದೆ',
    unused_otps: 'ಬಳಕೆಯಾಗದ OTPಗಳು',
    all_otps: 'ಎಲ್ಲಾ OTPಗಳು',
    back: 'ಹಿಂದೆ',
    print: 'ಮುದ್ರಿಸು',
    results: 'ಫಲಿತಾಂಶಗಳು',
    positions_candidates: 'ಸ್ಥಾನಗಳು ಮತ್ತು ಅಭ್ಯರ್ಥಿಗಳು',
    add_candidate: '+ಅಭ್ಯರ್ಥಿ',
    add_position: '+ ಸ್ಥಾನ ಸೇರಿಸಿ',
    voter_url: 'ಮತದಾರರ URL',
    pro_url: 'Pro URL',
    action: 'ಕ್ರಮ',
    pending: 'ಬಾಕಿ',
    approved: 'ಅನುಮೋದಿಸಲಾಗಿದೆ',
    status: 'ಸ್ಥಿತಿ',
    confirm_activate: 'ಈ ಚುನಾವಣೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುವುದೇ? ಮತದಾರರು ಮತ ಚಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತದೆ.',
    confirm_close: 'ಈ ಚುನಾವಣೆಯನ್ನು ಮುಚ್ಚುವುದೇ? ಮುಂದೆ ಯಾವುದೇ ಮತಗಳನ್ನು ಸ್ವೀಕರಿಸಲಾಗುವುದಿಲ್ಲ.',
    confirm_delete: 'ಈ ಚುನಾವಣೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುವುದೇ?',
    confirm_mock: 'ಮಾದರಿ ಸ್ಥಾನಗಳು ಮತ್ತು ಅಭ್ಯರ್ಥಿಗಳೊಂದಿಗೆ ಮಾಕ್ ಚುನಾವಣೆಯನ್ನು ರಚಿಸುವುದೇ?',
    confirm_reset_votes: 'ಎಲ್ಲಾ ಪ್ಲತ್ ಮತಗಳನ್ನು ತೆಗೆದುಹಾಕಿ OTP ರಿಸೆಟ್ ಮಾಡುವುದೇ? ಇದನ್ನು ರದ್ದುಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    reset_votes: 'ಮತ ರದ್ದುಮಾಡಿ',
    confirm_delete_candidate: 'ಈ ಅಭ್ಯರ್ಥಿಯನ್ನು ಅಳಿಸುವುದೇ?',
    confirm_delete_booth: 'ಈ ಮತಗಟ್ಟೆಯನ್ನು ಅಳಿಸುವುದೇ?',
    confirm_unbind: 'ಈ IP ಬಂಧನವನ್ನು ತೆಗೆದುಹಾಕುವುದೇ?',
    confirm_reject_device: 'ಈ ಸಾಧನವನ್ನು ತಿರಸ್ಕರಿಸುವುದೇ?',
    title_required: 'ಶೀರ್ಷಿಕೆ ಅಗತ್ಯವಿದೆ',
    name_required: 'ಹೆಸರು ಅಗತ್ಯವಿದೆ',
    enter_6letter_code: '6-ಅಕ್ಷರದ ಕೋಡ್ ನಮೂದಿಸಿ',
    code_6chars: 'ಕೋಡ್ ನಿಖರವಾಗಿ 6 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು',
    enter_booth_name: 'ಮತಗಟ್ಟೆಯ ಹೆಸರು ನಮೂದಿಸಿ',
    booth_create_desc: 'ಮತಗಟ್ಟೆ ಹೆಸರನ್ನು ನಮೂದಿಸಿ, ಅನನ್ಯ 6-ಅಕ್ಷರದ ಕೋಡ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರಚಿಸಲಾಗುತ್ತದೆ.',
    no_unused_otps: 'ಮುದ್ರಿಸಲು ಬಳಕೆಯಾಗದ OTPಗಳಿಲ್ಲ',
    create_booth_success: 'ಮತಗಟ್ಟೆಯನ್ನು ಕೋಡ್‌ನೊಂದಿಗೆ ರಚಿಸಲಾಗಿದೆ: ',

    // Voter
    ready: 'ಸಿದ್ಧ',
    voted: 'ಮತ ಚಲಾಯಿಸಲಾಗಿದೆ',
    done_label: 'ಮುಗಿದಿದೆ',
    vote: 'ಮತ ಚಲಾಯಿಸಿ',
    confirm_vote: 'ನಿಮ್ಮ ಮತವನ್ನು ದೃಢೀಕರಿಸಿ',
    cancel_vote: 'ರದ್ದುಮಾಡಿ',
    confirm_vote_btn: 'ಮತ ದೃಢಪಡಿಸಿ',
    thank_you: 'ಧನ್ಯವಾದಗಳು!',
    vote_recorded: 'ನಿಮ್ಮ ಮತವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ.',
    close_window: 'ನೀವು ಈ ವಿಂಡೋವನ್ನು ಮುಚ್ಚಬಹುದು.',
    for_: 'ಗಾಗಿ',
    initializing: 'ಆರಂಭಿಸಲಾಗುತ್ತಿದೆ...',
    select_candidate_prompt: 'ನಿಮ್ಮ ಅಭ್ಯರ್ಥಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನೀಲಿ VOTE ಬಟನ್ ಒತ್ತಿರಿ',
    select_for: 'ಇದಕ್ಕಾಗಿ ಅಭ್ಯರ್ಥಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ',
    no_active_election: 'ಯಾವುದೇ ಸಕ್ರಿಯ ಚುನಾವಣೆ ಇಲ್ಲ. ದಯವಿಟ್ಟು ನಿರ್ವಾಹಕರು ಒಂದನ್ನು ಪ್ರಾರಂಭಿಸುವವರೆಗೆ ಕಾಯಿರಿ.',
    enter_token: 'ಮತ ಚಲಾಯಿಸಲು ನಿಮ್ಮ ಮತಗಟ್ಟೆ ಟೋಕನ್ ನಮೂದಿಸಿ',
    token_placeholder: 'ಟೋಕನ್ ಅನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ',
    start_voting: 'ಮತ ಚಲಾಯಿಸಲು ಪ್ರಾರಂಭಿಸಿ',
    position_of: 'ಸ್ಥಾನ',
    of: 'ರಲ್ಲಿ',
    please_select: 'ದಯವಿಟ್ಟು ಮೊದಲು ಅಭ್ಯರ್ಥಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    casting_vote: 'ನಿಮ್ಮ ಮತವನ್ನು ದಾಖಲಿಸಲಾಗುತ್ತಿದೆ...',
    vote_recorded_for: 'ಇವರಿಗೆ ಮತ ದಾಖಲಿಸಲಾಗಿದೆ',
    e_vote_title: '🗳️ ಇ-ವೋಟ್',
    booth_name_label: '🗳️ ಇ-ವೋಟ್',
    next_voter_ready: 'ಮುಂದಿನ ಮತದಾರರು ಶೀಘ್ರದಲ್ಲೇ ಸಿದ್ಧ...',
    ready_label: 'ಸಿದ್ಧ',
    ip_bindings: 'IP ಬೈಂಡಿಂಗ್ಗಳು',
    binding_desc: 'ಬೂತ್ ಕೋಡ್‌ಗಳಿಗೆ ಬದ್ಧವಾಗಿರುವ IP ವಿಳಾಸಗಳು. ಸಾಧನವು ತನ್ನ ಬೂತ್ ಕೋಡ್ ಅನ್ನು ಮರು-ನಮೂದಿಸಲು ಬೈಂಡಿಂಗ್ ಅನ್ನು ಅಳಿಸಿ.',
    no_bindings: 'ಯಾವುದೇ ಸಕ್ರಿಯ ಬೈಂಡಿಂಗ್‌ಗಳಿಲ್ಲ.',
    unbind: 'ಅನ್ಬೈಂಡ್',
    ip_address: 'IP ವಿಳಾಸ',
    binding_type: 'ಪ್ರಕಾರ',
    binding_created: 'ರಚಿಸಲಾಗಿದೆ',

    // Pro
    pro_login: 'Pro ಮತಗಟ್ಟೆ ಲಾಗಿನ್',
    pro_desc: 'ಮತದಾನ ಪ್ರಗತಿಯನ್ನು ವೀಕ್ಷಿಸಲು ನಿರ್ವಾಹಕರು ನೀಡಿದ ಟೋಕನ್ ನಮೂದಿಸಿ.',
    booth_token: 'ಮತಗಟ್ಟೆ ಟೋಕನ್',
    token_placeholder_pro: 'ನಿಮ್ಮ ಟೋಕನ್ ಅನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ',
    connect: 'ಸಂಪರ್ಕಿಸಿ',
    select_election: 'ಚುನಾವಣೆ ಆಯ್ಕೆಮಾಡಿ',
    live_results: 'ನೇರ ಫಲಿತಾಂಶಗಳು',
    no_positions: 'ಯಾವುದೇ ಸ್ಥಾನಗಳನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಲಾಗಿಲ್ಲ.',
    no_elections_found: 'ಯಾವುದೇ ಚುನಾವಣೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ನಿರ್ವಾಹಕರನ್ನು ಕೇಳಿ.',
    votes_cast: 'ಚಲಾವಣೆಯಾದ ಮತಗಳು',
    total_voters: 'ಒಟ್ಟು ಮತದಾರರು',
    turnout: 'ಮತದಾನ ಪ್ರಮಾಣ',
    not_connected: 'ಸಂಪರ್ಕವಿಲ್ಲ',
    connected: 'ಸಂಪರ್ಕಿಸಲಾಗಿದೆ',
    waiting_votes: 'ಮತಗಳಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...',
    no_voters: 'ಇನ್ನೂ ಯಾವುದೇ ಮತದಾರರು ನೋಂದಾಯಿಸಿಲ್ಲ',
    of_voters: 'ರಲ್ಲಿ',
    voters_percent: 'ಮತದಾರರು',
    preside_off: '🗳️ ಪ್ರಿಸೈಡಿಂಗ್ ಆಫೀಸರ್',
    evm_status: 'EVM ಸ್ಥಿತಿ',
    no_evms_connected: 'ಇನ್ನೂ ಯಾವುದೇ EVM ಗಳು ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ. ನೋಂದಾಯಿಸಲು ಮತದಾರರ ಪುಟಗಳನ್ನು ತೆರೆಯಿರಿ.',
    evms: 'EVMಗಳು',
    pending_evms_desc: 'ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿರುವ EVMಗಳು. ಪ್ರತಿ ಸಾಧನವನ್ನು ಅನುಮೋದಿಸಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ.',
    no_pending_evms: 'ಯಾವುದೇ ಬಾಕಿ ಇರುವ EVM ಅನುಮೋದನೆಗಳಿಲ್ಲ.',
    approve: 'ಅನುಮೋದಿಸಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    new_binding: 'ಹೊಸ IP ಬೈಂಡಿಂಗ್',
    awaiting_approval: 'ಅನುಮೋದನೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
    evm_pending_desc: 'ಈ EVM ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
    booth_pending_desc: 'ಈ ಮತಗಟ್ಟೆ ಸಾಧನವು ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...',
    booth_devices: 'ಮತಗಟ್ಟೆ ಸಾಧನಗಳು',
    pending_booth_desc: 'ನಿರ್ವಾಹಕರ ಅನುಮೋದನೆಗಾಗಿ ಕಾಯುತ್ತಿರುವ ಮತಗಟ್ಟೆ ಸಾಧನಗಳು (Pro ಇಂಟರ್ಫೇಸ್‌ಗಳು).',
    no_pending_booth_devices: 'ಯಾವುದೇ ಬಾಕಿ ಇರುವ ಮತಗಟ್ಟೆ ಸಾಧನ ಅನುಮೋದನೆಗಳಿಲ್ಲ.',
    device: 'ಸಾಧನ',
    admin_panel: 'ನಿರ್ವಾಹಕ ಫಲಕ',
    mock_link: 'ಮಾಕ್ ಮತದಾನ ಪ್ರಯತ್ನಿಸಿ',
    landing_title: 'ಇ-ವೋಟ್',
    landing_subtitle: 'ವಿದ್ಯಾರ್ಥಿ ಸಂಘ ಚುನಾವಣಾ ವೇದಿಕೆ',
    register_as_evm: 'EVM ಆಗಿ ನೋಂದಾಯಿಸಿ',
    register_as_evm_desc: 'ಮತದಾರರು ತಮ್ಮ ಮತ ಚಲಾಯಿಸಲು ಈ ಸಾಧನವನ್ನು ಮತಯಂತ್ರವಾಗಿ ಬಳಸಿ',
    register_as_booth: 'ಮತಗಟ್ಟೆಯಾಗಿ ನೋಂದಾಯಿಸಿ',
    register_as_booth_desc: 'EVM ಸ್ಥಿತಿ, ಮತದಾನ ಪ್ರಮಾಣ ಮತ್ತು ಪ್ರಗತಿಯನ್ನು ನೇರವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ',
    alignment: 'ಜೋಡಣೆ',
    crop_preview: 'ಕ್ರಾಪ್ ಪೂರ್ವವೀಕ್ಷಣೆ',
    settings: 'ಮುದ್ರಣ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    settings_desc: 'ಎಲ್ಲಾ ಮುದ್ರಿತ ದಾಖಲೆಗಳಲ್ಲಿ (ಅಭ್ಯರ್ಥಿಗಳ ಪಟ್ಟಿ, OTP ಸ್ಲಿಪ್‌ಗಳು, ಫಲಿತಾಂಶಗಳು) ಕಾಣಿಸಿಕೊಳ್ಳುವ ಶಾಲೆಯ ಹೆಸರು ಮತ್ತು ಲೋಗೋವನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.',
    school_name: 'ಶಾಲೆಯ ಹೆಸರು',
    school_logo_url: 'ಶಾಲೆಯ ಲೋಗೋ URL',
    logo_hint: 'ಕ್ರಾಪ್ ಉಪಕರಣವನ್ನು ಬಳಸಿ ಲೋಗೋ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು URL ಅನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ, ಅಥವಾ ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಚಿತ್ರ URL ಅನ್ನು ಬಳಸಿ.',
    settings_saved: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.',
    browse: 'ಬ್ರೌಸ್',
    serial: 'ಸರಣಿ ಸಂಖ್ಯೆ',
    serial_placeholder: 'ಉದಾ: 1',
  }
};

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || 'kn';
let _isAdminPage = false;

function __(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  document.documentElement.lang = lang === 'kn' ? 'kn' : 'en';
  document.body.classList.toggle('lang-kn', lang === 'kn');
  document.body.classList.toggle('lang-en', lang === 'en');
  // Update toggle button
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'kn' ? 'English' : '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1';
  });
  // Re-translate page
  translatePage();
}

function toggleLanguage() {
  const newLang = currentLang === 'en' ? 'kn' : 'en';
  setLanguage(newLang);
  if (_isAdminPage && typeof api === 'function') {
    api('/admin/settings', { method: 'PUT', body: { language: newLang } });
  }
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = __(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = __(key);
  });
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    el.value = __(key);
  });
}

function initLanguage() {
  // Load font dynamically for Kannada
  if (!document.querySelector('#anek-kannada-font')) {
    const link = document.createElement('link');
    link.id = 'anek-kannada-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Anek+Kannada:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
  }
  fetch('/api/settings/language').then(r => r.json()).then(d => {
    setLanguage(d.language || 'kn');
    if (_isAdminPage) localStorage.setItem(LANG_STORAGE_KEY, d.language || 'kn');
  }).catch(() => setLanguage(currentLang));
}

// Language toggle button factory
function langToggleButton() {
  const btn = document.createElement('button');
  btn.className = 'btn btn-sm lang-toggle';
  btn.style.cssText = 'background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);font-family:"Anek Kannada","Space Grotesk",sans-serif';
  btn.textContent = currentLang === 'kn' ? 'English' : 'ಕನ್ನಡ';
  btn.onclick = toggleLanguage;
  return btn;
}
