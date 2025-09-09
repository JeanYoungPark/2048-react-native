import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, PanResponder, SafeAreaView, Modal } from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import { useGame } from "../hooks/useGame";
import useInterstitialAd from "../hooks/useInterstitialAd";
import TileComponent from "./TileComponent";
import AdBanner from "./AdBanner";
import { styles } from "../styles/GameStyles";

const Game2048 = () => {
    const { score, bestScore, won, over, keepPlaying, tiles, move, restart, isGameTerminated } = useGame();

    // 전면광고 훅 사용
    const { showAdWithProbability } = useInterstitialAd();

    // 개인정보처리방침 모달 상태
    const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

    // AdMob 초기화
    useEffect(() => {
        mobileAds()
            .initialize()
            .then((adapterStatuses) => {
                // AdMob 초기화 완료
            })
            .catch((error) => {
                // AdMob 초기화 실패 처리
            });
    }, []);

    // 재시작 (광고 후 게임 시작)
    const handleRestart = async () => {
        console.log("Restart button clicked");

        try {
            // 40% 확률로 광고 시도
            const shouldShowAd = Math.random() < 0.5;

            if (shouldShowAd) {
                console.log("광고 표시 시도...");

                try {
                    // 광고 표시 (최대 3초 대기)
                    const adResult = await Promise.race([
                        showAdWithProbability(1.0),
                        new Promise((resolve) => setTimeout(() => resolve({ shown: false, reason: "timeout" }), 3000)),
                    ]);

                    console.log("광고 결과:", adResult);

                    // 광고 표시 성공 여부와 관계없이 게임 재시작
                    restart();
                } catch (error) {
                    console.log("광고 에러, 게임 재시작 진행:", error);
                    restart();
                }
            } else {
                console.log("광고 확률 미해당 - 즉시 재시작");
                restart();
            }
        } catch (error) {
            console.error("Restart error:", error);
            // 에러 발생 시에도 게임은 재시작
            restart();
        }
    };

    // 개인정보처리방침 모달 열기
    const openPrivacyPolicy = () => {
        setPrivacyModalVisible(true);
    };

    // 개인정보처리방침 모달 닫기
    const closePrivacyPolicy = () => {
        setPrivacyModalVisible(false);
    };

    // Gesture handling for swipes
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt) => {
            // 오버레이가 활성화된 경우 터치 이벤트를 무시
            if (over || won) {
                return false;
            }
            return true;
        },
        onMoveShouldSetPanResponder: (evt) => {
            // 오버레이가 활성화된 경우 터치 이벤트를 무시
            if (over || won) {
                return false;
            }
            return true;
        },
        onPanResponderGrant: () => {},
        onPanResponderMove: () => {},
        onPanResponderRelease: (evt, gestureState) => {
            const { dx, dy } = gestureState;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);

            // Minimum swipe distance
            if (Math.max(absDx, absDy) > 30) {
                if (absDx > absDy) {
                    // Horizontal swipe
                    move(dx > 0 ? 1 : 3);
                } else {
                    // Vertical swipe
                    move(dy > 0 ? 2 : 0); // Down : Up
                }
            }
        },
        onPanResponderTerminationRequest: () => true,
    });

    const renderGrid = () => {
        const rows = [];
        for (let y = 0; y < 4; y++) {
            const cells = [];
            for (let x = 0; x < 4; x++) {
                cells.push(<View key={`${x}-${y}`} style={[styles.gridCell, x === 3 && { marginRight: 0 }]} />);
            }
            rows.push(
                <View key={String(y)} style={[styles.gridRow, y === 3 && { marginBottom: 0 }]}>
                    {cells}
                </View>
            );
        }
        return rows;
    };

    const renderTiles = () => {
        if (!tiles) return [];

        return tiles.map((tile) => <TileComponent key={tile.id} tile={tile} />);
    };

    const renderOverlay = () => {
        if (!isGameTerminated && !won) return null;

        let messageText = "";
        if (won && !keepPlaying) {
            messageText = "축하합니다!\n2048을 달성했습니다!";
        } else if (over) {
            messageText = "게임 오버!";
        }

        if (!messageText) return null;

        const shouldShowButton = (won || over);

        return (
            <View style={styles.overlay}>
                <Text style={styles.overlayText} allowFontScaling={false}>{messageText}</Text>
                {shouldShowButton && (
                    <View style={styles.overlayButtons}>
                        <TouchableOpacity 
                            style={styles.overlayButton} 
                            onPress={handleRestart}
                            activeOpacity={0.7}>
                            <Text style={styles.overlayButtonText} allowFontScaling={false}>다시시도</Text>
                        </TouchableOpacity>
                        
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <Text style={styles.title} allowFontScaling={false}>2048</Text>
                    <View style={styles.scoreContainer}>
                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreLabel} allowFontScaling={false}>점수</Text>
                            <Text style={styles.scoreValue} allowFontScaling={false}>{score}</Text>
                        </View>
                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreLabel} allowFontScaling={false}>최고점</Text>
                            <Text style={styles.scoreValue} allowFontScaling={false}>{bestScore}</Text>
                        </View>
                    </View>
                </View>

                {/* 중앙 게임 영역 */}
                <View style={styles.gameArea}>
                    <View style={styles.intro}>
                        <Text style={styles.introText} allowFontScaling={false}>스와이프하여 타일을 이동시키세요.{"\n"}같은 숫자의 타일이 만나면 합쳐집니다!</Text>
                        <TouchableOpacity style={styles.button} onPress={handleRestart} activeOpacity={0.7}>
                            <Text style={styles.buttonText} allowFontScaling={false}>새 게임</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.gameContainer}>
                        <View style={styles.gridContainer} {...panResponder.panHandlers}>
                            {renderGrid()}

                            <View style={styles.tileContainer}>{renderTiles()}</View>

                            {renderOverlay()}
                        </View>
                    </View>

                    <View style={styles.instructions}>
                        <TouchableOpacity style={styles.privacyLink} onPress={openPrivacyPolicy} activeOpacity={0.7}>
                            <Text style={styles.privacyLinkText} allowFontScaling={false}>개인정보처리방침</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 화면 하단 고정 배너 광고 */}
            <View style={styles.fixedAdContainer}>
                <AdBanner />
            </View>

            {/* 개인정보처리방침 모달 */}
            <Modal animationType='slide' transparent={false} visible={privacyModalVisible} onRequestClose={closePrivacyPolicy}>
                <SafeAreaView style={styles.privacyContainer}>
                    <View style={styles.privacyHeader}>
                        <TouchableOpacity style={styles.backButton} onPress={closePrivacyPolicy} activeOpacity={0.7}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.privacyTitle}>개인정보처리방침</Text>
                    </View>

                    <ScrollView style={styles.privacyContent} showsVerticalScrollIndicator={true} bounces={true} scrollEnabled={true}>
                        <View style={styles.privacySection}>
                            <Text style={styles.privacyIntro}>본 앱은 Google AdMob을 통해 광고를 제공합니다.</Text>

                            <View style={styles.privacySectionBlock}>
                                <Text style={styles.privacySectionTitle}>수집하는 정보</Text>
                                <Text style={styles.privacyListItem}>• 게임 점수 (기기에만 저장)</Text>
                                <Text style={styles.privacyListItem}>• 광고 관련 정보 (Google AdMob)</Text>
                            </View>

                            <View style={styles.privacySectionBlock}>
                                <Text style={styles.privacySectionTitle}>광고 설정</Text>
                                <Text style={styles.privacyListItem}>• Android: 설정 → Google → 광고</Text>
                                <Text style={styles.privacyListItem}>• iOS: 설정 → 개인정보 보호 → Apple 광고</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default Game2048;
