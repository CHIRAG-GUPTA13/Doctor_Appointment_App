package com.project.jsb.security.config;

import com.project.jsb.security.jwt.AuthTokenFilter;
import com.project.jsb.security.jwt.JwtAuthEntryPoint;
import com.project.jsb.security.jwt.JwtUtils;
import com.project.jsb.security.user.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.security.oauth2.jwt.Jwt;


@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;
    private final JwtUtils jwtUtils;

    public WebSecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthEntryPoint authEntryPoint, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;
        this.jwtUtils = jwtUtils;
    }

    private static final List<String> SECURED_URLS = List.of("/api/v1/testing/**");


    @Bean
    public AtomicLong atomicLong() {
        return new AtomicLong();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthTokenFilter authTokenFilter() {
        return new AuthTokenFilter();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint));
        http.authenticationProvider(daoAuthenticationProvider());
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();


//        return http
//                .cors(Customizer.withDefaults())
//                .csrf(AbstractHttpConfigurer::disable)
//                .exceptionHandling(exception->exception.authenticationEntryPoint(authEntryPoint))
//                .authorizeHttpRequests(request -> request
//                        .requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated().anyRequest().permitAll()
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .httpBasic(Customizer.withDefaults())
//                .authenticationProvider(daoAuthenticationProvider()).addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class)
//                .oauth2ResourceServer(oauth -> oauth
//                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter()))
//                )
//                .build();


    }


//    JwtAuthenticationConverter jwtAuthConverter() {
//        JwtGrantedAuthoritiesConverter jwtAuth = new JwtGrantedAuthoritiesConverter();
//        jwtAuth.setAuthoritiesClaimName("roles");
//        jwtAuth.setAuthorityPrefix("");
//        JwtAuthenticationConverter jwtConvertor = new JwtAuthenticationConverter();
//        jwtConvertor.setJwtGrantedAuthoritiesConverter(jwtAuth);
//        return jwtConvertor;
//    }
//    @Bean
//    public JwtDecoder jwtDecoder() {
//        return new JwtDecoder() {
//            @Override
//            public Jwt decode(String token) throws JwtException {
//                try {
//                    // Use your custom validation logic
//                    JwtUtils jwtUtils = new JwtUtils();  // Ensure it's a Spring-managed bean
//                    if (!jwtUtils.validateToken(token)) {
//                        throw new JwtException("Invalid JWT token");
//                    }
//
//                    Claims claims = Jwts.parserBuilder()
//                            .setSigningKey(jwtUtils.key())  // Use your key
//                            .build()
//                            .parseClaimsJws(token)
//                            .getBody();
//
//                    return Jwt.withTokenValue(token)
//                            .claim("sub", claims.getSubject())
//                            .claim("id", claims.get("id"))
//                            .claim("roles", claims.get("roles"))
//                            .issuedAt(claims.getIssuedAt().toInstant())
//                            .expiresAt(claims.getExpiration().toInstant())
//                            .build();
//                } catch (Exception e) {
//                    throw new JwtException("JWT validation failed: " + e.getMessage());
//                }
//            }
//        };
//    }


}
